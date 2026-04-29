const express = require("express");
const auth = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");
const controller = require("../controllers/pcs");

const router = express.Router();

router.post("/", auth, requirePermission("manage_layout"), controller.upsertLayout);

module.exports = router;
