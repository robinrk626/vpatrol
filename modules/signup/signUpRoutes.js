const express = require('express');
const { checkSignupParams } = require('./signUpMiddleware');
const { signUp } = require('./signUpController');
const routes = express();

routes.post('/', checkSignupParams, signUp);

module.exports = routes;