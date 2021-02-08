const express = require('express');

const router = express.Router();

const UserProfileController = require('../../controllers/userController');

router.route('/')
  .post(UserProfileController.create); 

module.exports = router;
