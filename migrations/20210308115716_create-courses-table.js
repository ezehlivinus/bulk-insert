exports.up = async (knex) => {
  if (await knex.schema.hasTable('courses')) {
    return false;
  }

  await knex.schema.createTable('courses', (table) => {
    table.increments('id').primary();
    table.string('title');
    table.text('description');
    table.enu('major', ['General', 'Arts', 'Science', 'Social Science']);

    table.integer('grade_id')
      .notNullable()
      .references('id')
      .inTable('grade_levels')
      .onDelete('CASCADE')
      .index();

    table.timestamps(true, true);
  });
};
// 20210305183110
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('courses');
};
