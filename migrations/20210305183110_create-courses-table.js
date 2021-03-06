exports.up = async (knex) => {
  if (await knex.schema.hasTable('courses')) {
    return false;
  }

  await knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('title');
    table.text('description');
    table.boolean('is_archived').default(false);
    table.enu('major', ['General', 'Arts', 'Science', 'Social Science']);

    // To be added
    // educational_stage

    // references grade level to be added

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('courses');
};
