const Knex = require('knex');
const { Model, ForeignKeyViolationError, ValidationError } = require('objection');

const database = require('../knexfile');

// database
let knex = Knex(database.development);
if (process.env.NODE_ENV === 'production') {
  knex = Knex(database.production);
}

module.exports = () => {
  Model.knex(knex);
  return knex;
};
