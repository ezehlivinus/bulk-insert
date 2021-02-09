const bcrypt = require('bcrypt');
const _ = require('lodash');
const sheetReader = require('read-excel-file/node');
const { getJsDateFromExcel } = require('excel-date-to-js');
const Joi = require('joi');
const { User, validateUser, validateExcelData } = require('../models/User');
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
  // return res.send('users');

  // const { value, error } = schema.validate(user);

  if (!('file' in req)) {
    return res.status(400).send({
      success: false,
      message: 'no files were uploaded or attached'
    });
  }
  // return res.send('users');

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

  const users = [];
  const userError = [];
  rows.forEach((row, rIndex) => {
    const user = {

    };
    headers.forEach((header, hIndex) => {
      // convert excel-number-date to JS date
      const cell = hIndex === 8 ? getJsDateFromExcel(row[hIndex]) : row[hIndex];
      user[header] = cell;
    });

    const { value, error } = validateExcelData(user);

    if (error) {
      userError.push({ user: value, error: error.details[0].message });
    } else {
      users.push(user);
    }
  });

  await deleteFile(req.file);

  // we want to find find many where their id occurred
  

  if (_.isEmpty(userError)) {
    return res.status(201).send({
      success: true,
      message: `success : ${users.length} users created`,
      data: users
    });
  }

  return res.status(200).send({
    success: true,
    message: 'success: though some data are invalid',
    data: { users, validationError: userError }
  });
};
