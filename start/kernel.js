const express = require('express');
const routes = require('./routes/index');

module.exports = (app) => {
  app.use(express.json());
  routes(app);
};
