const { body } = require("express-validator");

const eventValidator = [
  body("title").trim().notEmpty(),
  body("date").trim().notEmpty()
];

module.exports = { eventValidator };
