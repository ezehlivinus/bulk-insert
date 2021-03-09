const { EducationalStage } = require('../models/EducationalStage');

exports.create = async (req, res) => {
  // const validData = await validateGrade(req.body);

  // let grade = await EducationalStage.query().findOne({ title: validData.title });
  // if (grade) return res.status(409).send({ success: false, message: 'grade already exist' });

  const existingEducationalStages = [
    { code: 'S.S 1', title: 'Secondary' },
    { code: 'S.S 2', title: 'Secondary' },
    { code: 'S.S 3', title: 'Secondary' },
    { code: 'J.S.S 1', title: 'Secondary' },
    { code: 'J.S.S 2', title: 'Secondary' },
    { code: 'J.S.S 3', title: 'Secondary' },
    { code: 'Primary 1', title: 'Primary' },
    { code: 'Primary 2', title: 'Primary' },
    { code: 'Primary 3', title: 'Primary' },
    { code: 'Primary 4', title: 'Primary' },
    { code: 'Primary 5', title: 'Primary' },
    { code: 'Primary 6', title: 'Primary' }
  ];

  const codes = [
    'S.S 1', 'S.S 2', 'S.S 2',
    'J.S.S 1', 'J.S.S 2', 'J.S.S 3',
    'Primary 1', 'Primary 2', 'Primary 3',
    'Primary 4', 'Primary 5', 'Primary 6'
  ];

  // the whereNotIn('code', codes) is not working
  const eStages = await EducationalStage.query()
    .whereNotIn('code', codes).insert(existingEducationalStages);

  return res.status(201).send({
    success: true,
    message: 'educational stages created',
    data: eStages
  });
};
