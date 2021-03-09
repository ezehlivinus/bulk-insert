const express = require('express');
const GradeController = require('../../controllers/gradeController');

const router = express.Router();

router.route('/')
  .post(GradeController.create);

module.exports = router;
