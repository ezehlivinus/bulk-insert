const users = require('./users');
const usersProfiles = require('./userProfile');

module.exports = (app) => {
  app.use('/api/v1/users', users);
  app.use('/api/v1/user-profiles', usersProfiles);
};
