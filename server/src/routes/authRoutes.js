const express = require("express");
const rateLimit = require("express-rate-limit");
const { loginValidator } = require("../validators/authValidators");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");
const env = require("../config/env");
const controller = require("../controllers/auth");

const router = express.Router();
const limiter = rateLimit({
  windowMs: env.rateLimitWindowMs,
  max: env.rateLimitMax
});

router.post("/login", limiter, loginValidator, validate, controller.login);
router.post("/refresh", controller.refresh);
router.post("/logout", auth, controller.logout);
router.get("/me", auth, controller.me);
router.get("/sessions", auth, controller.sessions);

module.exports = router;
