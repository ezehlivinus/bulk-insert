const { GradeLevel, validateGrade } = require('../models/GradeLevel');

exports.create = async (req, res) => {
  // const validData = await validateGrade(req.body);

  // Note that the 'educational_stage_ids' is known before this operation
  // do make sure that the id match the referenced table
  const existingGradeLevels = [
    { title: 'S.S 1', educational_stage_id: 1 },
    { title: 'S.S 2', educational_stage_id: 1 },
    { title: 'S.S 3', educational_stage_id: 1 },
    { title: 'J.S.S 1', educational_stage_id: 2 },
    { title: 'J.S.S 2', educational_stage_id: 2 },
    { title: 'J.S.S 3', educational_stage_id: 2 },
    { title: 'Primary 1', educational_stage_id: 3 },
    { title: 'Primary 2', educational_stage_id: 3 },
    { title: 'Primary 3', educational_stage_id: 3 },
    { title: 'Primary 4', educational_stage_id: 3 },
    { title: 'Primary 5', educational_stage_id: 3 },
    { title: 'Primary 6', educational_stage_id: 3 }
  ];

  const gradeLevels = await GradeLevel.query()
    .insert(existingGradeLevels);

  return res.status(201).send({
    success: true,
    message: 'grade created',
    data: gradeLevels
  });
};
