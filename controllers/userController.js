/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const sheetReader = require('read-excel-file/node');
const Joi = require('joi');
const { User, validateUser, validateExcelData } = require('../models/User');
const { UserProfile } = require('../models/UserProfile');
const { processStudentFile } = require('../services/upload-service');
const { crunchStudentData } = require('../services/crunch-data-service');

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

exports.list = async (req, res) => {
  const users = await User.query();

  if (_.isEmpty(users)) return res.status(409).send({ success: false, message: 'users not found' });

  res.status(200).send({ success: true, message: 'user list', data: users });
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

  // if nothing will be created
  if (_.isEmpty(toBeInserted)) {
    return res.status(400).send({
      success: false,
      message: 'no profile was created',
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
