const express = require('express');
const router = express.Router();

router.use('/dashboard', require('./restaurant'))
router.use('/user', require('./user'))
router.use('/auth', require('./auth'))

module.exports = router