exports.up = async (knex) => {
  if (await knex.schema.hasTable('grade_levels')) {
    return true;
  }

  await knex.schema.createTable('grade_levels', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable(); // ex: Primary 1
    table.boolean('is_archived').default(false);

    table.integer('educational_stage_id')
      .notNullable()
      .references('id')
      .inTable('educational_stages')
      .onDelete('CASCADE')
      .index();

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('grade_levels');
};
