const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { requirePermission } = require("../middlewares/permission");
const { pcValidator } = require("../validators/pcValidators");
const controller = require("../controllers/pcs");

const router = express.Router();

router.get("/", auth, requirePermission("manage_pcs"), controller.listPcs);
router.post("/", auth, requirePermission("manage_pcs"), pcValidator, validate, controller.createPc);
router.put("/:id", auth, requirePermission("manage_pcs"), controller.updatePc);

module.exports = router;
