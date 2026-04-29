const { body } = require("express-validator");

const guestRegistrationValidator = [
  body("fullName").trim().notEmpty(),
  body("contactNumber").trim().notEmpty(),
  body("visitPurpose").trim().notEmpty(),
  body("wantsPc").isBoolean(),
  body("source").isIn(["server_registration", "qr_self_service"])
];

module.exports = { guestRegistrationValidator };
