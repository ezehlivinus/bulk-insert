const _ = require('lodash');
const sheetReader = require('read-excel-file/node');
const path = require('path');
const { UserProfile, validateUserProfile } = require('../models/UserProfile');
const { User } = require('../models/User');
const { processStudentFile } = require('../services/upload-service');
const { crunchStudentData } = require('../services/crunch-data-service');
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
  const rows = await sheetReader(req.file.path);
  // process student file and validate data
  const { validUsers, userValidationError } = await processStudentFile(rows, req);

  // get the valid users' email
  const validUsersEmails = validUsers.map((user, index) => user.email);

  // find their id in db
  const usersInDb = await User.query()
    .select('id', 'email')
    .whereIn('email', validUsersEmails);
  // crunch the data : in db and validated
  const { notToBeInserted, toBeInserted } = await crunchStudentData(usersInDb, validUsers);

  const created = 'are lists of users whose profiles was created for';
  const notCreated = 'are list of users whose data was validated but they does not exist';
  const validationError = 'these are set of users whose detail failed to validate';

  // nothing was created because no user(s) with any of the email in the file uploaded
  if (_.isEmpty(toBeInserted)) {
    return res.status(400).send({
      success: false,
      message: 'no profile was created. This happens because no user(s) with any of the email in the file uploaded. Let the users created an account',
      data: {
        notCreated: notToBeInserted,
        validationError: userValidationError,
        meta: {
          notCreated, validationError
        }
      }
    });
  }

  // insert multiple profiles, this throws error when user_id already exist
  const userProfiles = await UserProfile.query()
    .insert(toBeInserted);

  // const u = await knex('users')
  //   .whereNotExists(async (builder) => builder.select('*').from('user_profiles'));

  // when there is no validation error
  if (_.isEmpty(userValidationError)) {
    return res.status(201).send({
      success: true,
      message: 'all data validated',
      data: {
        created: userProfiles,
        notCreated: notToBeInserted,
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
      created: userProfiles,
      notCreated: notToBeInserted,
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
