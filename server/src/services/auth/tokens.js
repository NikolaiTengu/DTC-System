const jwt = require("jsonwebtoken");
const RefreshToken = require("../../models/RefreshToken");
const env = require("../../config/env");

function createAccessToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      permissions: user.permissions || []
    },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn }
  );
}

function createRefreshTokenValue(user) {
  return jwt.sign({ sub: user._id.toString() }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpiresIn
  });
}

async function persistRefreshToken(user, token, req) {
  const decoded = jwt.decode(token);
  await RefreshToken.create({
    userId: user._id,
    token,
    expiresAt: new Date(decoded.exp * 1000),
    createdByIp: req.ip,
    userAgent: req.headers["user-agent"] || ""
  });
}

async function revokeRefreshToken(token) {
  await RefreshToken.deleteOne({ token });
}

async function validateRefreshToken(token) {
  const payload = jwt.verify(token, env.jwtRefreshSecret);
  const stored = await RefreshToken.findOne({ token }).populate({
    path: "userId",
    populate: { path: "roleIds" }
  });
  if (!stored) return null;
  return { payload, stored };
}

module.exports = {
  createAccessToken,
  createRefreshTokenValue,
  persistRefreshToken,
  revokeRefreshToken,
  validateRefreshToken
};
