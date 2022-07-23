const express = require('express');
const router = express.Router();
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');

router.get('/:id',auth,sauceCtrl.getOneSauce);
router.get('/',auth, sauceCtrl.getAllSauces);