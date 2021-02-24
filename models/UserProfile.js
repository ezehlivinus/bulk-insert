const { Model } = require('objection');
const Joi = require('joi');

class UserProfile extends Model {
  static get tableName() {
    return 'user_profiles';
  }

  static get relationMappings() {
    const { User } = require('./User');
    return {
      user: {
        // inverse relation to user model
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'user_profile.user_id',
          to: 'user.id'
        }
      }
    };
  }
}

const validateUserProfile = async (userProfile = {}) => {
  const schema = Joi.object({
    first_name: Joi.string().min(6).max(60).required(),
    last_name: Joi.string().min(6).max(60).required(),
    // bio: Joi.string().min(6).max(60).trim()

  });

  const value = await schema.validateAsync(userProfile);

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
    phone_number: Joi.number().required(),
    address: Joi.string().required(),
    birth_date: Joi.date().required()

  });
  return schema.validateAsync(user);
};

module.exports = {
  UserProfile, validateUserProfile, validateExcelData
};
