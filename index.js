const express = require('express');
const Knex = require('knex');
require('express-async-errors');
require('dotenv').config();

const { Model, ForeignKeyViolationError, ValidationError } = require('objection');
const database = require('./knexfile');
const start = require('./start/kernel');

let knex = Knex(database.production);

if (process.env.NODE_ENV === 'production') {
  knex = Knex(process.env.DATABASE_URL);
}

Model.knex(knex);

const app = express();

start(app);

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
  console.log(
    'Connected to', database.production.connection.database, 'database'
  );
});

module.exports = {
  app, server, Knex
};
