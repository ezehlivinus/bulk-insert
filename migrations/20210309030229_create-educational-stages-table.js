exports.up = async (knex) => {
  if (await knex.schema.hasTable('educational_stages')) {
    return false;
  }

  await knex.schema.createTable('educational_stages', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('code').notNullable();

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('educational_stages');
};
