const User = require("../../models/User");
const asyncHandler = require("../../utils/asyncHandler");
const pick = require("../../utils/pick");
const { buildListQuery, paginate } = require("../../utils/query");
const { logAudit } = require("../../services/audit/logAudit");

const listUsers = asyncHandler(async (req, res) => {
  const { page, limit, sort, filters } = buildListQuery(req.query, ["isActive", "email"]);
  const query = User.find(filters).populate("roleIds").sort(sort);
  const result = await paginate(query, { page, limit });
  res.json(result);
});

const createUser = asyncHandler(async (req, res) => {
  const payload = pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
    "phone",
    "position",
    "roleIds",
    "isActive"
  ]);
  payload.createdBy = req.user._id;
  payload.updatedBy = req.user._id;
  const user = await User.create(payload);
  const hydrated = await User.findById(user._id).populate("roleIds");
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "create_user",
    module: "users",
    targetId: user._id.toString(),
    newValues: { ...payload, password: "[REDACTED]" }
  });
  res.status(201).json(hydrated);
});

const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("+password");
  const oldValues = user?.toObject();
  const updates = pick(req.body, [
    "firstName",
    "lastName",
    "email",
    "password",
    "phone",
    "position",
    "roleIds"
  ]);
  Object.assign(user, updates, { updatedBy: req.user._id });
  await user.save();
  const hydrated = await User.findById(user._id).populate("roleIds");
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: "update_user",
    module: "users",
    targetId: req.params.id,
    oldValues: oldValues ? { ...oldValues, password: "[REDACTED]" } : null,
    newValues: updates.password ? { ...updates, password: "[REDACTED]" } : updates
  });
  res.json(hydrated);
});

const setUserActive = asyncHandler(async (req, res) => {
  const isSuperAdmin = (req.user.roleIds || []).some((role) => role.name === "super_admin");
  if (!isSuperAdmin) {
    return res.status(403).json({ message: "Only super_admin can activate or inactivate users" });
  }
  const user = await User.findById(req.params.id);
  const oldValues = { isActive: user.isActive };
  user.isActive = req.body.isActive;
  user.updatedBy = req.user._id;
  await user.save();
  await logAudit({
    req,
    actorUserId: req.user._id,
    actorName: req.user.fullName,
    action: req.body.isActive ? "activate_user" : "inactivate_user",
    module: "users",
    targetId: req.params.id,
    oldValues,
    newValues: { isActive: user.isActive }
  });
  res.json(user);
});

module.exports = { listUsers, createUser, updateUser, setUserActive };
