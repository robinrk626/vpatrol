const express = require('express');
const {
  checkLoginParams,
} = require('./loginMiddleware');
const { login } = require('./loginController');

const routes = express();

routes.post('/', checkLoginParams, login);

module.exports = routes;