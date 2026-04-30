const AppError = require("../utils/AppError");

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    message: err.message || "Internal server error"
  };

  if (err.details) payload.details = err.details;

  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "Validation error", details: err.errors });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ message: "Token expired" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "Duplicate value detected", details: err.keyValue });
  }

  // Log all errors for debugging
  console.error("Request Error:", {
    method: req.method,
    path: req.path,
    statusCode,
    message: err.message,
    name: err.name,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined
  });

  if (!(err instanceof AppError) && process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  return res.status(statusCode).json(payload);
}

module.exports = errorHandler;
