'use strict';

const express = require('express');
const router = express.Router();
const login = require('../controllers/login');
const passport = require('passport');

router.get('/', login.renderLogin);

router.post('/', passport.authenticate('local'), login.post);

module.exports = router;