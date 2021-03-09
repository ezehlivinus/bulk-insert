const sheetReader = require('read-excel-file/node');
const _ = require('lodash');
const { Course } = require('../models/Course');
const { processCourseData } = require('../services/upload-service');

exports.createMany = async (req, res) => {
  if (!('file' in req)) {
    return res.status(400).send({
      success: false,
      message: 'no files were uploaded or attached'
    });
  }

  const rows = await sheetReader(req.file.path);
  rows.shift();

  const {
    validCourses,
    courseValidationError
  } = await processCourseData(rows);

  const newCourses = await Course.query().insert(validCourses);

  if (_.isEmpty(newCourses)) {
    return res.status(400).send({
      success: false,
      message: 'no course was created',
      data: {
        validationError: courseValidationError,
        newCourses
      }
    });
  }

  return res.status(201).send({
    success: true,
    message: 'courses was created',
    data: {
      newCourses,
      validationError: courseValidationError
    }
  });
};
