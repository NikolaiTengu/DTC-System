const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), "..", ".env") });
dotenv.config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  workstationUrl: process.env.WORKSTATION_URL || "http://localhost:5174",
  mongodbUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/dtc_management",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "change_me_access_secret",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "change_me_refresh_secret",
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
  jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  cookieSecret: process.env.COOKIE_SECRET || "change_me_cookie_secret",
  superAdminEmail: process.env.SUPER_ADMIN_EMAIL || "admin@dict-dtc.local",
  superAdminPassword: process.env.SUPER_ADMIN_PASSWORD || "ChangeMe123!",
  serverOperatorEmail: process.env.SERVER_OPERATOR_EMAIL || "operator@dict-dtc.local",
  serverOperatorPassword: process.env.SERVER_OPERATOR_PASSWORD || "ChangeMe123!",
  defaultPcTokenSecret: process.env.DEFAULT_PC_TOKEN_SECRET || "change_me_pc_token_secret",
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 100),
  defaultAssignmentStrategy: process.env.DEFAULT_ASSIGNMENT_STRATEGY || "sortOrder"
};
