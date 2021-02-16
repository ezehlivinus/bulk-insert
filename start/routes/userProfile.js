const express = require('express');

const router = express.Router();

const UserProfileController = require('../../controllers/userProfileController');

router.route('/')
  .get(UserProfileController.list)
  .post(UserProfileController.create); 

module.exports = router;
