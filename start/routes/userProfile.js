const express = require('express');

const router = express.Router();

const { upload } = require('../../config/multer');
const UserProfileController = require('../../controllers/userProfileController');

router.route('/')
  .get(UserProfileController.list)
  .post(UserProfileController.create);

router.route('/create-many')
  .post([
    upload.single('_file')
  ], UserProfileController.createMany);

router.get('/sample',
  UserProfileController.sample);

module.exports = router;
