const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { requirePermission } = require("../middlewares/permission");
const { feedbackResponseValidator } = require("../validators/feedbackValidators");
const controller = require("../controllers/feedbackResponses");

const router = express.Router();

router.get("/", auth, requirePermission("view_reports"), controller.listResponses);
router.post("/", feedbackResponseValidator, validate, controller.createResponse);

module.exports = router;
