const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { requirePermission } = require("../middlewares/permission");
const { roleValidator } = require("../validators/roleValidators");
const controller = require("../controllers/roles");

const router = express.Router();

router.get("/", auth, requirePermission("manage_roles"), controller.listRoles);
router.post("/", auth, requirePermission("manage_roles"), roleValidator, validate, controller.createRole);
router.put("/:id", auth, requirePermission("manage_roles"), roleValidator, validate, controller.updateRole);

module.exports = router;
