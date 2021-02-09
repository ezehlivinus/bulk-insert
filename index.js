const express = require('express');
const Knex = require('knex');
const { Model, ForeignKeyViolationError, ValidationError } = require('objection');
const database = require('./knexfile');
const start = require('./start/kernel');

const knex = Knex(database.production);
Model.knex(knex);

const app = express();

start(app);

const PORT = process.env.PORT || 2021

const server = app.listen(PORT, () => {
  console.log('Listening on port ', PORT);
});

module.exports = {
  app, server
};
