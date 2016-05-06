var express = require('express');
var router = express.Router();
var login = require('../controllers/login');
var passport = require('passport');

router.get('/', login.renderLogin);

router.post('/', passport.authenticate('local'), login.post);

module.exports = router;