const { Grade, validateGrade } = require('../models/Grade');

exports.create = async (req, res) => {
  // const validData = await validateGrade(req.body);

  // let grade = await Grade.query().findOne({ title: validData.title });
  // if (grade) return res.status(409).send({ success: false, message: 'grade already exist' });

  const existingGrades = [
    { title: 'S.S 1', educational_stage_id: 1},
    { title: 'S.S 2', educational_stage_id: 2 },
    { title: 'S.S 3', educational_stage_id: 3 },
    { title: 'J.S.S 1', educational_stage_id: 4 },
    { title: 'J.S.S 2', educational_stage_id: 5 },
    { title: 'J.S.S 3', educational_stage_id: 6 },
    { title: 'Primary 1', educational_stage_id: 7 },
    { title: 'Primary 2', educational_stage_id: 8 },
    { title: 'Primary 3', educational_stage_id: 9 },
    { title: 'Primary 4', educational_stage_id: 10 },
    { title: 'Primary 5', educational_stage_id: 11 },
    { title: 'Primary 6', educational_stage_id: 12 }
  ];

  const titles = [
    'S.S 1', 'S.S 2', 'S.S 2',
    'J.S.S 1', 'J.S.S 2', 'J.S.S 3',
    'Primary 1', 'Primary 2', 'Primary 3',
    'Primary 4', 'Primary 5', 'Primary 6'
  ];

  // the whereNotIn('title', titles) is not working
  const grade = await Grade.query()
    .whereNotIn('title', titles).insert(existingGrades);

  return res.status(201).send({
    success: true,
    message: 'grade created',
    data: grade
  });
};
