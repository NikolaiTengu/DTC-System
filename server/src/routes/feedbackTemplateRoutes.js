const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const { requirePermission } = require("../middlewares/permission");
const { feedbackTemplateValidator } = require("../validators/feedbackValidators");
const controller = require("../controllers/feedbackTemplates");

const router = express.Router();

router.get("/", auth, requirePermission("manage_feedback_forms"), controller.listTemplates);
router.post("/", auth, requirePermission("manage_feedback_forms"), feedbackTemplateValidator, validate, controller.createTemplate);
router.put("/:id", auth, requirePermission("manage_feedback_forms"), feedbackTemplateValidator, validate, controller.updateTemplate);

module.exports = router;
