const { Model } = require('objection');
// const Joi = require('joi');

class EducationalStage extends Model {
  // Table name is the only required property.
  static get tableName() {
    return 'educational_stages';
  }
}

module.exports = {
  EducationalStage
};
