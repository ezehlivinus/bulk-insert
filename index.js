/* eslint-disable no-console */
const express = require('express');
const Knex = require('knex');
require('express-async-errors');
// require('dotenv').config();

const { Model, ForeignKeyViolationError, ValidationError } = require('objection');
const database = require('./knexfile');
const start = require('./start/kernel');

const app = express();

start(app);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  // database
  let knex = Knex(database.development);
  if (process.env.NODE_ENV === 'production') {
    knex = Knex(database.production);
  }

  Model.knex(knex);

  console.log('Listening on port ', PORT);

  console.log('Connected to database...');
});

module.exports = {
  app, server, Knex
};
