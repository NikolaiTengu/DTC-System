const AppError = require("../utils/AppError");

function requirePermission(...permissions) {
  return function checkPermission(req, res, next) {
    if (!req.user) return next(new AppError("Authentication required", 401));
    const granted = req.user.permissions || [];
    const allowed = permissions.every((permission) => granted.includes(permission));
    if (!allowed) return next(new AppError("Insufficient permissions", 403));
    next();
  };
}

module.exports = { requirePermission };
