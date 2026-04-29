const User = require("../../models/User");
const RefreshToken = require("../../models/RefreshToken");
const asyncHandler = require("../../utils/asyncHandler");
const AppError = require("../../utils/AppError");
const { logAudit } = require("../../services/audit/logAudit");
const { getUserPermissions } = require("../../services/users/permissions");
const {
  createAccessToken,
  createRefreshTokenValue,
  persistRefreshToken,
  revokeRefreshToken,
  validateRefreshToken
} = require("../../services/auth/tokens");

const sanitizeUser = (user) => ({
  _id: user._id,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  phone: user.phone,
  position: user.position,
  isActive: user.isActive,
  lastLoginAt: user.lastLoginAt,
  roles: (user.roleIds || []).map((role) => ({
    _id: role._id,
    name: role.name,
    permissions: role.permissions
  })),
  permissions: getUserPermissions(user)
});

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).populate("roleIds").select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid credentials", 401);
  }
  if (!user.isActive) {
    throw new AppError("User account is inactive", 403);
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = createAccessToken({ ...user.toObject(), permissions: getUserPermissions(user) });
  const refreshToken = createRefreshTokenValue(user);
  await persistRefreshToken(user, refreshToken, req);
  await logAudit({
    req,
    actorUserId: user._id,
    actorName: user.fullName,
    action: "login",
    module: "auth",
    targetId: user._id.toString()
  });

  res.json({
    accessToken,
    refreshToken,
    user: sanitizeUser(user)
  });
});

const refresh = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;
  if (!token) throw new AppError("Refresh token required", 400);
  const { stored } = await validateRefreshToken(token);
  if (!stored || !stored.userId?.isActive) throw new AppError("Invalid refresh token", 401);
  const user = stored.userId;
  const accessToken = createAccessToken({ ...user.toObject(), permissions: getUserPermissions(user) });
  res.json({ accessToken, user: sanitizeUser(user) });
});

const logout = asyncHandler(async (req, res) => {
  const token = req.body.refreshToken;
  if (token) {
    await revokeRefreshToken(token);
  }
  if (req.user) {
    await logAudit({
      req,
      actorUserId: req.user._id,
      actorName: req.user.fullName,
      action: "logout",
      module: "auth",
      targetId: req.user._id.toString()
    });
  }
  res.json({ message: "Logged out successfully" });
});

const me = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate("roleIds");
  res.json({ user: sanitizeUser(user) });
});

const sessions = asyncHandler(async (req, res) => {
  const sessions = await RefreshToken.find({ userId: req.user._id }).sort({ createdAt: -1 });
  res.json({ items: sessions });
});

module.exports = { login, refresh, logout, me, sessions };
