const jwt = require("jsonwebtoken");
const User = require("../models/User");
const env = require("../config/env");
const AppError = require("../utils/AppError");
const { getUserPermissions } = require("../services/users/permissions");

async function auth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return next(new AppError("Authentication required", 401));
  }

  const token = header.split(" ")[1];
  const payload = jwt.verify(token, env.jwtAccessSecret);
  const user = await User.findById(payload.sub).populate("roleIds").select("+password");
  if (!user || !user.isActive) {
    return next(new AppError("User is inactive or not found", 401));
  }

  req.user = user;
  req.user.permissions = getUserPermissions(user);
  next();
}

module.exports = auth;
