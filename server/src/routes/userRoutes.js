const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { requirePermission } = require("../middlewares/permission");
const { createUserValidator, updateUserValidator } = require("../validators/userValidators");
const controller = require("../controllers/users");

const router = express.Router();

router.get("/", auth, requirePermission("manage_users"), controller.listUsers);
router.post("/", auth, requirePermission("manage_users"), createUserValidator, validate, controller.createUser);
router.put("/:id", auth, requirePermission("manage_users"), updateUserValidator, validate, controller.updateUser);
router.patch("/:id/active", auth, requirePermission("activate_users"), controller.setUserActive);

module.exports = router;
