exports.up = async (knex) => {
  await knex.schema.alterTable('user_profiles', (table) => {
    table.unique('user_id');
  });
};

exports.down = async (knex) => {
  await knex.schema.alterTable('user_profiles', (table) => {
    table.dropUnique('user_id');
  });
};
