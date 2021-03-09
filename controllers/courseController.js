/* eslint-disable no-continue */
/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */
const sheetReader = require('read-excel-file/node');
const _ = require('lodash');
const path = require('path');
const { Course } = require('../models/Course');
const { processCourseData, deleteFile } = require('../services/upload-service');
const { GradeLevel } = require('../models/GradeLevel');

exports.createMany = async (req, res) => {
  if (!('file' in req)) {
    return res.status(400).send({
      success: false,
      message: 'no files were uploaded or attached'
    });
  }

  // read sheets in file
  // const rows = await sheetReader(req.file.path); //was used to handle a single sheet
  // returns array of sheets
  const sheets = await sheetReader(req.file.path, { getSheets: true });

  /*
  The structure of rows below
  rows = [
    [
      [each of student detail], [], ...
    ],

    [
      [teachers detail], [], ...
    ]
  ]
  */
  const rows = [];
  const noGradeLevel = [

  ];

  for (const sheet of sheets) {
    const sheetRows = await sheetReader(req.file.path, { sheet: sheet.name });

    // remove header of each sheet
    sheetRows.shift();

    const gradeLevel = await GradeLevel.query()
      .select('id', 'title')
      .where('title', sheet.name);

    if (_.isEmpty(gradeLevel)) {
      noGradeLevel.push({
        'Grade Level': sheet.name,
        courses: sheetRows,
        reason: 'grade level not found'
      });
      continue;
    }
    // prepare and make the each course have grade_id Property
    const courses = [];

    sheetRows.forEach((course, index) => {
      // course fields
      const headers = [
        'title',
        'description',
        'major',
        'grade_id'
      ];

      const _course = {};
      headers.forEach((header, hIndex) => {
        let cell;
        if (header === 'grade_id') {
          cell = gradeLevel[0].id;
        } else {
        // make major title/capitalised case
        // eslint-disable-next-line max-len
        // cell = header === 'major' ? course[hIndex][0].toUpperCase() + course[hIndex].slice(1).toLowerCase() : course[hIndex];
          // the above failed for two words
          cell = course[hIndex];
        }

        _course[header] = cell;
      }); // end forEach header

      courses.push(_course);
    }); // end sheetRows.forEach course

    rows.push(courses);
  } // end for

  await deleteFile(req.file);

  const flattenedRows = rows.flat();
  const {
    validCourses,
    courseValidationError
  } = await processCourseData(flattenedRows);

  const newCourses = await Course.query().insert(validCourses);

  if (_.isEmpty(newCourses)) {
    return res.status(400).send({
      success: false,
      message: 'no course was created',
      data: {
        validationError: courseValidationError,
        newCourses,
        noGradeLevel

      }
    });
  }

  return res.status(201).send({
    success: true,
    message: 'courses was created',
    data: {
      newCourses,
      noGradeLevel,
      validationError: courseValidationError
    }
  });
};

// send back a sample of the excel file
exports.sample = async (req, res) => {
  res.status(200).sendFile(path.resolve('public/sample-courses-import.xlsx'));
};
