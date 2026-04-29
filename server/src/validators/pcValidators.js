const { body } = require("express-validator");

const pcValidator = [
  body("pcCode").trim().notEmpty(),
  body("displayName").trim().notEmpty()
];

module.exports = { pcValidator };
