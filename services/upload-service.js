/* eslint-disable no-underscore-dangle */
const fsPromises = require('fs').promises;
const { getJsDateFromExcel } = require('excel-date-to-js');
const _ = require('lodash');
const { validateCourse } = require('../models/Course');
const { validateExcelData } = require('../models/UserProfile');

// const multer = require('multer');
// const { storage } = require('../config/temp');

// delete a  file
/**
 * @description delete a file
 * @param {Object} file is the object req.file contain file info
 * @returns boolean
 */
exports.deleteFile = async (file) => {
  // if the file exist
  try {
    await fsPromises.access(file.path);
    await fsPromises.unlink(file.path);

    return true;
  } catch (error) {
    // one of access, unlink normally throw error,
    // when the file does not exits, we do nothing if that happens
    return false;
  }
};

/**
 * Process uploaded user data
 */
exports.processUserData = async (rows, req) => {
  try {
    // skip headers
    // this has been removed previously before the rows was passed
    // let headers = rows.shift();
    // the above headers are not well formed
    const headers = [
      'first_name',
      'last_name',
      'other_names',
      'display_name',
      'gender',
      'email',
      'phone_number',
      'address',
      'birth_date'
    ];

    const validUsers = [];
    const userValidationError = [];
    rows.forEach((row, rIndex) => {
      const user = {};
      headers.forEach((header, hIndex) => {
      // convert excel-number-date to JS date
        let cell = hIndex === 8 ? getJsDateFromExcel(row[hIndex]) : row[hIndex];
        if (header === 'gender') {
        // we only keep lower gender values
        // Joi synchronous validate() was unable convert it unlike it async counterpart
          cell = cell.toLowerCase();
        }
        user[header] = cell;
      });

      const { value, error } = validateExcelData(user);

      if (error) {
        userValidationError.push({
          user: value,
          error: error.details[0].message
        });
      } else {
        validUsers.push(user);
      }
    });

    await this.deleteFile(req.file);
    return { validUsers, userValidationError };
  } catch (error) {
    throw new Error(error);
  }
};

exports.processCourseData = async (rows) => {
  const headers = [
    'title',
    'description',
    'major',
    'grade'
  ];

  try {
    const validCourses = [];
    const courseValidationError = [];
    rows.forEach((row, rIndex) => {
      const course = {};

      headers.forEach((header, hIndex) => {
        const _header = header === 'grade' ? 'grade_id' : header;
        // make major title/capitalised case
        const cell = header === 'major' ? row[hIndex][0].toUpperCase() + row[hIndex].slice(1).toLowerCase() : row[hIndex];
        // row[hIndex][0].toUpperCase() + row[hIndex].slice(1).toLowerCase()
        course[_header] = cell;
      });

      const { value, error } = validateCourse(course);

      if (error) {
        courseValidationError.push({
          user: value,
          error: error.details[0].message
        });
      } else {
        validCourses.push(value);
      }
    });
    return { validCourses, courseValidationError };
  } catch (error) {
    throw new Error(error);
  }
};
