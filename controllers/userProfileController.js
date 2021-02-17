const _ = require('lodash')
const { UserProfile, validateUserProfile } = require('../models/UserProfile');

exports.create = async (req, res) => {
  const validData = await validateUserProfile(req.body);

  let user = await UserProfile.query().findOne({ email: validData.email });
  if (user) return res.status(409).send({ success: false, message: 'user already exist' });

  user = await UserProfile.query().insert(validData);

  return res.status(201).send({
    success: true, message: 'success', data: _.omit(user, ['password'])
  });
};


exports.list = async (req, res) => {
  const usersProfiles = await UserProfile.query();
  if (_.isEmpty(usersProfiles)) return res.status(409).send({ success: false, message: 'proifile not found' });

  res.status(200).send({ success: true, message: 'user profiles', data: usersProfiles })
}