const express = require('express');
const { upload } = require('../../config/multer');
const CourseController = require('../../controllers/courseController');

const router = express.Router();

router.route('/create-many')
  .post([
    upload.single('courses')
  ], CourseController.createMany);

router.get('/sample-courses-file', CourseController.sample);

module.exports = router;
