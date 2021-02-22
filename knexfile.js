require('dotenv').config();

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    },
    pool: {
      min: 2,
      max: 10
    }
  },
  production: {
    client: 'pg',
    connection: process.env.HEROKU_POSTGRESQL_JADE_URL,
    migrations: {
      directory: `./migrations`
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
