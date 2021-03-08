exports.up = async (knex) => {
  if (await knex.schema.hasTable('grades')) {
    return false;
  }

  await knex.schema.createTable('grades', (table) => {
    table.increments('id').primary();
    table.string('title');
    table.boolean('is_archived').default(false);
    table.integer('educational_stage');

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('grades');
};
