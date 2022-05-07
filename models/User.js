const { Schema, model } = require('mongoose');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

// Defining Schema for User document
const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        minLength: 5,
        maxLength: 255,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minLength: 8,
        maxLength: 1024,
        required: true,
    }
});

// Defining method in the schema to generate JWT for Authentication
UserSchema.methods.generateJWT = function () {
    const token = jwt.sign({ _id: this._id,name: this.name, email: this.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: 365 * 24 * 3600,
    });

    return token;
}

// Defining validation function for user Signup using JOi
const validateFields = user => {
    // Joi schema for validation
    const ValidationSchema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
            .min(5)
            .max(255)
            .required(),
        password: Joi.string()
            .min(8)
            .max(255)
            .required(),
    });

    return ValidationSchema.validate(user);
}

module.exports.User = model('User', UserSchema); // exporting User model
module.exports.validateFields = validateFields; // exporting validation function for signup fields