const { body } = require("express-validator");

const roleValidator = [
  body("name").trim().notEmpty(),
  body("permissions").isArray()
];

module.exports = { roleValidator };
