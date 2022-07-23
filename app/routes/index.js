const express = require('express');
const router = express.Router();
const userRoutes = require('./user');


//path for user routes
router.use('/api/auth', userRoutes);

module.exports = router;