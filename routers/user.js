const express = require('express');
const router = express.Router(); // Creating router object
const {createUser,authUser} = require('../controllers/user');

router.route('/signup').post(createUser); // defining route for signup and attaching a handler method
router.route('/signin').post(authUser); // defining route for login and attaching a handler method

module.exports = router; // Exporting router