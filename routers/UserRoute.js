
const express = require('express');
const { signup, login, getUserInfo } = require('../controllers/UserController');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('userInfo', getUserInfo);

module.exports = router