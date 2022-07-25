const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer');

router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauces);
router.post("/", auth, multer, sauceCtrl.createSauce);

module.exports = router;