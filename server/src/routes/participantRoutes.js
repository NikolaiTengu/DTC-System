const express = require("express");
const auth = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalAuth");
const { requirePermission } = require("../middlewares/permission");
const controller = require("../controllers/participants");

const router = express.Router();

router.post("/", optionalAuth, controller.registerParticipant);
router.patch("/:id/attendance", auth, requirePermission("manage_events"), controller.updateAttendance);

module.exports = router;
