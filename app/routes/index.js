const express = require('express');
const router = express.Router();
const userRoutes = require('./user');
const sauceRoutes = require('./sauce');


//path for user & sauce routes
router.use('/auth', userRoutes);
router.use('/sauces', sauceRoutes);


module.exports = router;