/* eslint-disable no-restricted-syntax */
/* eslint-disable no-underscore-dangle */
const _ = require('lodash');

exports.crunchStudentData = async (usersInDb, validUsers) => {
  try {
  // check email that does not exist in db
    // get email in db
    const emailsInDb = [];
    usersInDb.forEach((user, index) => {
      emailsInDb.push(user.email);
    });

    // get emails in the uploaded file
    const emailsInFile = [];
    validUsers.forEach((user, index) => {
      emailsInFile.push(user.email);
    });

    // check for intersection :
    // users that is in database and also in excel-file
    const intersection = usersInDb
      .filter((email, index) => emailsInFile.includes(email.email));

    // emails that appear in file but not in database : emailsInFile - emailsInDb
    const difference = emailsInFile
      .filter((email, index) => !emailsInDb.includes(email));

    // ... validUsers minus difference
    const _difference = validUsers
      .filter((user, index) => difference.includes(user.email));

    // return res.send({ intersection, difference, _difference });

    // filter users from validated Users :
    // those to be inserted into db and those that wont make it
    const notToBeInserted = [];
    const toBeInserted = [];
    for (const user of validUsers) {
      const entry = intersection.find(({ email }) => email === user.email);

      if (_.isEmpty(entry)) {
      // this set of users does not exist in database
        notToBeInserted.push(user);
      } else {
      // prepare the data for user_profiles table
        user.user_id = entry.id;

        toBeInserted.push(_.omit(user, ['email']));
      }
    }

    return { notToBeInserted, toBeInserted };
  } catch (error) {
    throw new Error(error);
  }
};
