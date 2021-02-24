/* eslint-disable no-console */
const express = require('express');
const Knex = require('knex');
require('express-async-errors');
// require('dotenv').config();
require('./config/database')();

const { Model, ForeignKeyViolationError, ValidationError } = require('objection');
const database = require('./knexfile');
const start = require('./start/kernel');

const app = express();

app.use(express.static('public'));

start(app);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {

  console.log('Listening on port ', PORT);

  console.log('Connected to database...');
});

module.exports = {
  app, server
};
