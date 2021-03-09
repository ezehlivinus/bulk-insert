const { Model } = require('objection');
const Joi = require('joi');

class Grade extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'grades';
  }
}

const validateGrade = async (grade = {}) => {
  const schema = Joi.object({
    title: Joi.string().trim().required(),
    is_archived: Joi.boolean(),
    educational_stage_id: Joi.number()
  });

  const value = schema.validateAsync(grade);

  return value;
};

module.exports = {
  Grade, validateGrade
};
