const express = require("express");
const auth = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");
const controller = require("../controllers/sessions");

const router = express.Router();

router.get("/", auth, requirePermission("manage_guests"), controller.listSessions);
router.get("/active", auth, requirePermission("manage_guests"), controller.activeSessions);
router.post("/:id/checkout", auth, requirePermission("manage_guests"), controller.checkoutSession);

module.exports = router;
