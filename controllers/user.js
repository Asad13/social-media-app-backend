const bcrypt = require('bcrypt'); // For hashing password
const _ = require('lodash');
const { User, validateFields } = require('../models/User'); // importing User model and signup fileds validation function

module.exports.createUser = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });// Finding user with same email in our database
    if (user) return res.status(400).send("Email already exists."); //  If a user with the same email exists then he/she cannnot signup using it again

    const { error } = validateFields(_.pick(req.body, ['name','email', 'password'])); // Validating the signup values
    if (error) return res.status(400).send(error.details[0].message); // If even a single value fails our validation the user cannot signup

    user = new User(_.pick(req.body, ['name','email', 'password'])); // creating a user object using User model
    const salt = await bcrypt.genSalt(10); // Generating salt(A string) of round 10 for hashing password
    user.password = await bcrypt.hash(user.password, salt); // Hashing user-given password for security

    const token = user.generateJWT(); // generating token for the user to authenticate user
    try {
        const result = await user.save(); // saving user to our database

        // Signup successful. Sending him the token with user id and email
        return res.status(201).send({
            token: token,
            user: _.pick(result, ['_id', 'name', 'email']),
        });
    } catch (error) {
        //Signup not successful due to some errors
        return res.status(400).send("Something wrong. Please try again later.");
    }
}

module.exports.authUser = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });// Finding user with same email in our database
        if (!user) return res.status(400).send("Invalid email or password."); // User not found with this email

        // Valid email
        // Needs to check the password
        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) return res.status(400).send("Invalid email or password."); // Password not matched

        const token = user.generateJWT(); // generating token for the user to authenticate user

        // Signin successful. Sending him the token with user id and email
        return res.status(200).send({
            token: token,
            user: _.pick(user, ['_id', 'name', 'email']),
        });
    } catch (error) {
        //Signin not successful due to some errors
        return res.status(400).send("Something wrong. Please try again later.");
    }
}