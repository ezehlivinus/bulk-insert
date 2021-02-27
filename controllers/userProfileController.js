/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const _ = require('lodash');
const sheetReader = require('read-excel-file/node');
const path = require('path');
const { UserProfile, validateUserProfile } = require('../models/UserProfile');
const { User } = require('../models/User');
const { processUserData } = require('../services/upload-service');
const { crunchUserData } = require('../services/crunch-data-service');
const knex = require('../config/database')();

exports.create = async (req, res) => {
  const validData = await validateUserProfile(req.body);

  let user = await UserProfile.query().findOne({ email: validData.email });
  if (user) return res.status(409).send({ success: false, message: 'user already exist' });

  user = await UserProfile.query().insert(validData);

  return res.status(201).send({
    success: true, message: 'success', data: _.omit(user, ['password'])
  });
};

/**
 * @description create many users same time, data usually from excel or csv
 */
exports.createMany = async (req, res) => {
  if (!('file' in req)) {
    return res.status(400).send({
      success: false,
      message: 'no files were uploaded or attached'
    });
  }

  // read file
  // const rows = await sheetReader(req.file.path); //was used to handle a single sheet
  const sheets = await sheetReader(req.file.path, { getSheets: true });

  /*
  The structure of rows
  rows = [
    [
      [each of student detail], [], ...
    ],

    [
      [teachers detail], [], ...
    ]
  ]
  */
  const rows = [];
  for (const sheet of sheets) {
    // eslint-disable-next-line no-await-in-loop
    const sheetRows = await sheetReader(req.file.path, { sheet: sheet.name });

    // remove header of each sheet
    sheetRows.shift();

    rows.push(sheetRows);
  }

  /*
  this merge students' and teachers' records together so that we have
  flattenedRows = [
    [student 1], [student 2], ..., [teacher 1], [teacher 2]
  ]
  This structure is the type that can be processed below
  */
  const flattenedRows = rows.flat();
  // process student file and validate data
  const { validUsers, userValidationError } = await processUserData(flattenedRows, req);

  // get the valid users' emails
  const validUsersEmails = validUsers.map((user, index) => user.email);

  // find their id and email in db
  const usersInDb = await User.query()
    .select('id', 'email')
    .whereIn('email', validUsersEmails);

  const {
    _newUsers,
    _newUserProfiles,
    _existingUsers
  } = await crunchUserData(usersInDb, validUsers);

  // create new users where the email of the said users is not in database yet
  const newUsers = await User.query()
    .whereNotIn('email', validUsersEmails)
    .insert(_newUsers)
    .returning(['email', 'id']);

  const _newProfiles = [];
  for (const _newUserProfile of _newUserProfiles) {
    const _user = newUsers.find(({ email }) => email === _newUserProfile.email);

    if (!(_.isEmpty(_user))) {
      _newUserProfile.user_id = _user.id;
      _newProfiles.push(_.omit(_newUserProfile, ['email']));
    }
  }

  // create profile for this new users ::: likely the set of user does not have profiles
  // but if they do just do not insert
  const newProfiles = await UserProfile.query()
    .whereNotIn('user_id', _existingUsers.map((user) => user.user_id))
    .insert(_newProfiles);

  // we want to attempt creating this users' profile they might not really exist
  // const existing = await UserProfile.query()
  //   .whereNotIn('user_id', _newProfiles.map((user) => user.user_id))
  //   .insert(_existingUsers.map((user) => _.omit(user, ['email', 'id'])));

  const created = 'are lists of users whose accounts was created as well as profiles';
  const notCreated = 'are list of users whose data validated but they already have a user account and/or profile';
  const validationError = 'these are set of users whose detail failed to validate';

  // nothing was created because no user(s) with any of the email in the file uploaded
  if (_.isEmpty(newProfiles)) {
    return res.status(400).send({
      success: false,
      message: 'no profile was created. They might have account already, and may be profiles as well',
      data: {
        notCreated: _existingUsers,
        validationError: userValidationError,
        meta: {
          notCreated, validationError
        }
      }
    });
  }

  // when there is no validation error
  if (_.isEmpty(userValidationError)) {
    return res.status(201).send({
      success: true,
      message: 'all data validated',
      data: {
        created: newProfiles,
        notCreated: _existingUsers,
        meta: {
          created, notCreated
        }
      }
    });
  }

  // if there is validation error
  return res.status(201).send({
    success: true,
    message: 'success: though some data are invalid',
    data: {
      created: newProfiles,
      notCreated: _existingUsers,
      validationError: userValidationError,
      meta: {
        created, notCreated, validationError
      }
    }
  });
};

exports.list = async (req, res) => {
  const usersProfiles = await UserProfile.query();
  if (_.isEmpty(usersProfiles)) return res.status(409).send({ success: false, message: 'profile not found' });

  res.status(200).send({ success: true, message: 'user profiles', data: usersProfiles });
};

// send back a sample of the excel file to be uploaded for the said user
exports.sample = async (req, res) => {
  res.status(200).sendFile(path.resolve('public/sample-user-import.xlsx'));
};
