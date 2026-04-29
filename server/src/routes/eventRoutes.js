const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { requirePermission } = require("../middlewares/permission");
const { eventValidator } = require("../validators/eventValidators");
const controller = require("../controllers/events");

const router = express.Router();

router.get("/", auth, requirePermission("manage_events"), controller.listEvents);
router.get("/public", controller.listPublicEvents);
router.post("/", auth, requirePermission("manage_events"), eventValidator, validate, controller.createEvent);
router.put("/:id", auth, requirePermission("manage_events"), eventValidator, validate, controller.updateEvent);
router.get("/:eventId/participants", auth, requirePermission("manage_events"), controller.listEventParticipants);

module.exports = router;
