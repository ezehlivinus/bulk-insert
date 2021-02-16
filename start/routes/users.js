const express = require('express');

const router = express.Router();
const { upload } = require('../../config/multer');
const UserController = require('../../controllers/userController');

router.route('/')
  .get(UserController.list)
  .post(UserController.create);

router.route('/create-many')
  .post([upload.single('_file')], UserController.createMany);

module.exports = router;
