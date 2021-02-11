/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const sheetReader = require('read-excel-file/node');
const { getJsDateFromExcel } = require('excel-date-to-js');
const Joi = require('joi');
const { User, validateUser, validateExcelData } = require('../models/User');
const { UserProfile } = require('../models/UserProfile');
const { deleteFile } = require('../services/upload-service');

exports.create = async (req, res) => {
  const validData = await validateUser(req.body);

  let user = await User.query().findOne({ email: validData.email });
  if (user) return res.status(409).send({ success: false, message: 'user already exist' });

  const salt = await bcrypt.genSalt(10);
  validData.password = await bcrypt.hash(validData.password, salt);

  user = await User.query().insert(validData);

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

  const rows = await sheetReader(req.file.path);
  // skip headers
  let headers = rows.shift();
  // the above headers are not well formed
  headers = [
    'first_name',
    'last_name',
    'other_names',
    'display_name',
    'gender',
    'email',
    'phoneNumber',
    'address',
    'birth_date'
  ];

  const validUsers = [];
  const userValidationError = [];
  rows.forEach((row, rIndex) => {
    const user = {};
    headers.forEach((header, hIndex) => {
      // convert excel-number-date to JS date
      let cell = hIndex === 8 ? getJsDateFromExcel(row[hIndex]) : row[hIndex];
      if (header === 'gender') {
        // we only keep lower gender values
        // Joi synchronous validate() was unable convert it unlike it async counterpart
        cell = cell.toLowerCase();
      }
      user[header] = cell;
    });

    const { value, error } = validateExcelData(user);

    if (error) {
      userValidationError.push({
        user: value,
        error: error.details[0].message
      });
    } else {
      validUsers.push(user);
    }
  });

  await deleteFile(req.file);

  // get the valid users' email
  const validUsersEmails = validUsers.map((user, index) => user.email);

  // find their id in db
  const usersInDb = await User.query()
    .select('id', 'email')
    .whereIn('email', validUsersEmails);

  // check email that does not exist in db
  // get email in db
  const identities = [];
  const emailsInDb = [];
  usersInDb.forEach((user, index) => {
    identities.push(user.id);
    emailsInDb.push(user.email);
  });

  // get email in file
  const emailsInFile = [];
  validUsers.forEach((user, index) => {
    emailsInFile.push(user.email);
  });

  // check for intersection :
  // users that is in database and also in excel-file
  const intersection = usersInDb
    .filter((email, index) => emailsInFile.includes(email.email));

  // emails that appear in file but not in database
  const difference = emailsInFile
    .filter((email, index) => !emailsInDb.includes(email));

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

  // return res.send({ toBeInserted, notToBeInserted });

  const created = 'are lists of users that profile was created for';
  const notCreated = 'these users, their data validated but they does not exist';
  const validationError = 'these are set of users whose detail failed to validate';


  // if nothing will be created
  if (_.isEmpty(toBeInserted)) {
    return res.status(400).send({
      success: true,
      message: 'success: though some data are invalid',
      data: {
        notCreated: notToBeInserted,
        validationError: userValidationError,
        meta: {
          notCreated, validationError
        }
      }
    });
  }

  // insert multiple profiles
  const userProfiles = await UserProfile.query()
    .insert(toBeInserted);

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
