const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const ratelimiter = require("../middleware/rate-limit")

router.post("/signup", userCtrl.signup);
router.post("/login",ratelimiter, userCtrl.login);

module.exports = router;
