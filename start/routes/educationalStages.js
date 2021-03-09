const express = require('express');
const EStageController = require('../../controllers/educationalStageController');

const router = express.Router();

router.route('/')
  .post(EStageController.create);

module.exports = router;
