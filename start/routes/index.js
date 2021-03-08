const users = require('./users');
const usersProfiles = require('./userProfiles');
const courses = require('./courses');

module.exports = (app) => {
  app.use('/api/v1/users', users);
  app.use('/api/v1/user-profiles', usersProfiles);
  app.use('/api/v1/courses', courses);
};
