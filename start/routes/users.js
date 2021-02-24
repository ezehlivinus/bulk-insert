const express = require('express');

const router = express.Router();
const UserController = require('../../controllers/userController');

router.route('/')
  .get(UserController.list)
  .post(UserController.create);

module.exports = router;
