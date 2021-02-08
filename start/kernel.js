const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const routes = require('./routes/index');

const asyncError = require('../middlewares/async-error');

module.exports = (app) => {
  app.use(morgan('dev'));
  app.use(cors());
  app.use(express.json());
  routes(app);

  app.use(asyncError);
};
