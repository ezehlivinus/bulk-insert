const express = require('express');
const GradeController = require('../../controllers/gradeLevelController');

const router = express.Router();

router.route('/')
  .post(GradeController.create);

module.exports = router;
