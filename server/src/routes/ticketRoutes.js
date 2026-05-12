const express = require("express");
const controller = require("../controllers/tickets");

const router = express.Router();

router.post("/validate", controller.validateTicket);
router.post("/verify", controller.verifyTicket);
router.post("/checkout", controller.checkoutByTicket);
router.post("/handshake", controller.workstationHandshake);

module.exports = router;
