const { body } = require("express-validator");

const loginValidator = [
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 })
];

module.exports = { loginValidator };
