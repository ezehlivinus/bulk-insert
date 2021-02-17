exports.up = async (knex) => {
  if (await knex.schema.hasTable('user_profiles')) {
    return;
  }

  await knex.schema.createTable('user_profiles', (table) => {
    table.increments('id').primary();
    table.string('first_name', 255).notNullable();
    table.string('last_name', 255).notNullable();
    table.string('other_names', 255);
    table.string('display_name', 255);
    table.enu('gender', ['male', 'female']).notNullable();
    table.string('phone_number').notNullable();
    table.string('address');
    table.date('birth_date');

    table.integer('user_id')
      .references('id')
      .inTable('users')
      .onDelete('CASCADE')
      .index();

    table.timestamps(true, true);
  });
};

exports.down = async (knex) => {
  await knex.schema
    .dropTableIfExists('user_profiles');
};
