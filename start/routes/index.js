const users = require('./users');
const usersProfiles = require('./userProfiles');
const courses = require('./courses');
const gradeLevels = require('./gradeLevels');
const educationalStages = require('./educationalStages');

module.exports = (app) => {
  app.use('/api/v1/users', users);
  app.use('/api/v1/user-profiles', usersProfiles);
  app.use('/api/v1/grade-levels', gradeLevels);
  app.use('/api/v1/educational-stages', educationalStages);
  app.use('/api/v1/courses', courses);
};
