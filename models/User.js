const { Model } = require('objection');
const Joi = require('joi');
const _ = require('lodash');

class User extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'users';
  }

  // determine what is return during API response
  $formatJson(json) {
    json = super.$formatJson(json);
    delete json.password;
    return json;
  }

  static get relationMappings() {
    const { UserProfile } = require('./UserProfile');
    return {
      userProfiles: {
        relation: Model.HasOneRelation,
        modelClass: UserProfile,
        join: {
          from: 'users.id',
          to: 'userProfile.user_id'
        }
      }
    };
  }
}

const validateUser = async (user = {}) => {
  const schema = Joi.object({
    password: Joi.string().min(6).max(60).required(),
    email: Joi.string().email().trim().lowercase()
      .required()
  });

  const value = await schema.validateAsync(user);

  return value;
};

/**
 * @description validate user data from excel
 */
const validateExcelData = (user = {}) => {
  const schema = Joi.object({
    first_name: Joi.string().required().trim(),
    last_name: Joi.string().required().trim(),
    other_names: Joi.string().required().trim(),
    email: Joi.string().email().trim().lowercase()
      .required(),
    display_name: Joi.string().required(),
    gender: Joi.string().trim().required().lowercase(),
    phoneNumber: Joi.number().required(),
    address: Joi.string().required(),
    birth_date: Joi.date().required()

  });
  return schema.validateAsync(user);
};

module.exports = {
  User, validateUser, validateExcelData
};
