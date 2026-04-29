const { body } = require("express-validator");

const createUserValidator = [
  body("firstName").trim().notEmpty(),
  body("lastName").trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isLength({ min: 8 }),
  body("roleIds").isArray({ min: 1 })
];

const updateUserValidator = [
  body("firstName").optional().trim().notEmpty(),
  body("lastName").optional().trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  body("password").optional().isLength({ min: 8 }),
  body("roleIds").optional().isArray({ min: 1 })
];

module.exports = { createUserValidator, updateUserValidator };
