const express = require("express");
const auth = require("../middlewares/auth");
const { requirePermission } = require("../middlewares/permission");
const controller = require("../controllers/settings");

const router = express.Router();

router.get("/", auth, requirePermission("manage_layout"), controller.listSettings);
router.post("/", auth, requirePermission("manage_layout"), controller.upsertSettings);

module.exports = router;
