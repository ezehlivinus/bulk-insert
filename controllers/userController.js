const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validateUser } = require('../models/User');
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
  await deleteFile(req.file);
  return res.send(req.file.path);
};
