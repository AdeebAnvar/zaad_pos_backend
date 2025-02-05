const express = require('express');
const router = express.Router();
const userController = require('../controllers/user_controller');

// Route to get all users
router.get('/get_all_users', userController.getAllUsers);
router.post('/add_user', userController.addUser);
router.post('/login', userController.login);

module.exports = router;
