/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-restricted-syntax */
const bcrypt = require('bcrypt');
const _ = require('lodash');
const Joi = require('joi');
const { User, validateUser } = require('../models/User');

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
