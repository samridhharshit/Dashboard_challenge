const express = require('express');
const router = express.Router();

router.use('/restaurant', require('./restaurant'))
router.use('/user', require('./user'))
router.use('/auth', require('./auth'))

module.exports = router