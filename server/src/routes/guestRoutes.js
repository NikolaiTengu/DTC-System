const express = require("express");
const auth = require("../middlewares/auth");
const optionalAuth = require("../middlewares/optionalAuth");
const validate = require("../middlewares/validate");
const { requirePermission } = require("../middlewares/permission");
const { guestRegistrationValidator } = require("../validators/guestValidators");
const controller = require("../controllers/guests");

const router = express.Router();

router.get("/", auth, requirePermission("manage_guests"), controller.listGuests);
router.post("/", optionalAuth, guestRegistrationValidator, validate, controller.registerGuest);

module.exports = router;
