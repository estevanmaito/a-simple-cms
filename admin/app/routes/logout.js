var express = require('express');
var router = express.Router();
var logout = require('../controllers/logout');

router.get('/', logout.logout);

module.exports = router;