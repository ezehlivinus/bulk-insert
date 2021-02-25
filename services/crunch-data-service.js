/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');

exports.crunchStudentData = async (usersInDb, validUsers) => {
  try {
    // get emails in the uploaded file
    const emailsInFile = [];
    validUsers.forEach((user, index) => {
      emailsInFile.push(user.email);
    });

    // check for intersection :
    // users that is in database and also in excel-file
    const intersection = usersInDb
      .filter((email, index) => emailsInFile.includes(email.email));

    // filter users from validated Users :
    // those to be inserted into db and those that wont make it
    const _newUsers = [];
    const _newUserProfiles = [];
    const _existingUsers = [];

    for (const user of validUsers) {
      const entry = intersection.find(({ email }) => email === user.email);

      if (_.isEmpty(entry)) {
        _newUsers.push({ email: user.email, password: '4010Rooms' });
        _newUserProfiles.push(user);
      } else {
        // for already existing users in database
        // merge their properties with those in files
        _existingUsers.push({
          user_id: entry.id,
          ...user
        });
      }
    }

    return { _newUsers, _newUserProfiles, _existingUsers };
  } catch (error) {
    throw new Error(error);
  }
};
