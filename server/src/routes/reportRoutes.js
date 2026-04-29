const express = require("express");
const auth = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");
const controller = require("../controllers/reports");

const router = express.Router();

router.get("/dashboard", auth, requirePermission("view_reports"), controller.dashboard);
router.get("/guests", auth, requirePermission("view_reports"), controller.guestsReport);
router.get("/pcs", auth, requirePermission("view_reports"), controller.pcUsageReport);
router.get("/events", auth, requirePermission("view_reports"), controller.eventReport);
router.get("/feedback", auth, requirePermission("view_reports"), controller.feedbackReport);
router.get("/audit", auth, requirePermission("view_audit_logs"), controller.auditReport);

module.exports = router;
