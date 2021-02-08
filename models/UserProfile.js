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
    bio: Joi.string().min(6).max(60).trim()

  });

  const value = await schema.validateAsync(userProfile);

  return value;
};

module.exports = {
  UserProfile, validateUserProfile
};
