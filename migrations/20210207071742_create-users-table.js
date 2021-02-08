exports.up = async (knex) => {
  if (await knex.schema.hasTable('users')) {
    return;
  }

  await knex.schema.createTable('users', (table) => {
    table.increments('id').primary();
    table.string('email', 150).unique();
    table.string('password', 200).notNullable();
    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema
    .dropTableIfExists('users');
};
