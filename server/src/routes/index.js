const express = require("express");
const authRoutes = require("./authRoutes");
const userRoutes = require("./userRoutes");
const roleRoutes = require("./roleRoutes");
const guestRoutes = require("./guestRoutes");
const sessionRoutes = require("./sessionRoutes");
const pcRoutes = require("./pcRoutes");
const layoutRoutes = require("./layoutRoutes");
const ticketRoutes = require("./ticketRoutes");
const eventRoutes = require("./eventRoutes");
const participantRoutes = require("./participantRoutes");
const feedbackTemplateRoutes = require("./feedbackTemplateRoutes");
const feedbackResponseRoutes = require("./feedbackResponseRoutes");
const reportRoutes = require("./reportRoutes");
const auditLogRoutes = require("./auditLogRoutes");
const settingRoutes = require("./settingRoutes");

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/roles", roleRoutes);
router.use("/guests", guestRoutes);
router.use("/sessions", sessionRoutes);
router.use("/pcs", pcRoutes);
router.use("/layout", layoutRoutes);
router.use("/tickets", ticketRoutes);
router.use("/events", eventRoutes);
router.use("/participants", participantRoutes);
router.use("/feedback-templates", feedbackTemplateRoutes);
router.use("/feedback-responses", feedbackResponseRoutes);
router.use("/reports", reportRoutes);
router.use("/audit-logs", auditLogRoutes);
router.use("/settings", settingRoutes);

module.exports = router;
