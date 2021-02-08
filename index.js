const express = require('express');
const Knex = require('knex');
const { Model, ForeignKeyViolationError, ValidationError } = require('objection');
const database = require('./knexfile');
const start = require('./start/kernel');

const knex = Knex(database.production);
Model.knex(knex);

const app = express();

start(app);

const server = app.listen(2021, () => {
  console.log('Listening on port 2021');
});

module.exports = {
  app, server
};
