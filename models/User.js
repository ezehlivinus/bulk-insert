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


module.exports = {
  User, validateUser
};
