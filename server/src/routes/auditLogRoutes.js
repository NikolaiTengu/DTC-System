const express = require("express");
const auth = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");
const controller = require("../controllers/auditLogs");

const router = express.Router();

router.get("/", auth, requirePermission("view_audit_logs"), controller.listAuditLogs);

module.exports = router;
