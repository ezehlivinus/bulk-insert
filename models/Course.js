const { Model } = require('objection');
const Joi = require('joi');

class Course extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'courses';
  }
}

const validateCourse = async (course = {}) => {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    is_archived: Joi.boolean(),
    description: Joi.string()
  });

  const value = await schema.validateAsync(course);

  return value;
};

module.exports = {
  Course, validateCourse
};
