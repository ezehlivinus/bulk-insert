module.exports = {
  production: {
    client: 'pg',
    connection: {
      host: '127.0.0.1',
      user: 'postgres',
      password: 'root',
      database: 'bulky'
    },
    pool: {
      min: 2,
      max: 10
    }
  }
};
