const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const { getUserPermissions } = require("../services/users/permissions");

async function optionalAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next();
  }

  try {
    const token = header.split(" ")[1];
    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await User.findById(payload.sub).populate("roleIds");
    if (user?.isActive) {
      req.user = user;
      req.user.permissions = getUserPermissions(user);
    }
  } catch {
    // ignore invalid optional auth and continue as public
  }

  next();
}

module.exports = optionalAuth;
