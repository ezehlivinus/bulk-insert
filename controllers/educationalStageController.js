const { EducationalStage } = require('../models/EducationalStage');

exports.create = async (req, res) => {
  // const validData = await validateGrade(req.body);

  // let grade = await EducationalStage.query().findOne({ title: validData.title });
  // if (grade) return res.status(409).send({ success: false, message: 'grade already exist' });

  const existingEducationalStages = [
    { title: 'Senior Secondary School' },
    { title: 'Junior Secondary School' },
    { title: 'Primary School' },
    { title: 'Basic' },
    { title: 'Grade' }
  ];

  const titles = [
    'Primary School',
    'Junior Secondary School',
    'Senior Secondary School',
    'Basic', 'Grade'
  ];

  // the whereNotIn('title', titles) is not working
  const eStages = await EducationalStage.query()
    .whereNotIn('title', titles).insert(existingEducationalStages);

  return res.status(201).send({
    success: true,
    message: 'educational stages created',
    data: eStages
  });
};
