const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/user");
const ratelimiter = require("../middleware/rate-limit")
const auth = require("../middleware/auth")

router.post("/signup", userCtrl.signup);
router.post("/login",ratelimiter, userCtrl.login);
router.get('/', auth, userCtrl.readUser);
router.get('/export', auth, userCtrl.exportData);
router.put('/', auth, userCtrl.updateUser);
router.delete('/', auth, userCtrl.deleteUser);

module.exports = router;
