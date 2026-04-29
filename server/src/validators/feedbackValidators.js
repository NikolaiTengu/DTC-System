const { body } = require("express-validator");

const feedbackTemplateValidator = [
  body("name").trim().notEmpty(),
  body("questions").isArray()
];

const feedbackResponseValidator = [
  body("templateId").optional().trim().notEmpty(),
  body("answers").isObject()
];

module.exports = { feedbackTemplateValidator, feedbackResponseValidator };
