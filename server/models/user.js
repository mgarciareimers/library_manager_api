/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: User model.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');

const constants = require('../commons/constants');
const language = require('../language');

// Define schema.
const userSchema = new Schema({
    name: {
        type: String,
        required: [true, constants.errorCodes.USER_NAME_REQUIRED],
    },
    surname: {
        type: String,
        required: [true, constants.errorCodes.USER_SURNAME_REQUIRED],
    },
    email: {
        type: String,
        unique: true,
        required: [true, constants.errorCodes.USER_EMAIL_REQUIRED],
    },
    hashedPassword: {
        type: String,
        required: [true, constants.errorCodes.USER_PASSWORD_REQUIRED],
    },
    role: {
        type: String,
        enum: {
            values: [ constants.strings.ROLE_ADMIN, constants.strings.ROLE_USER ],
            message: constants.errorCodes.USER_ROLE_NOT_VALID,
        },
        default: constants.strings.ROLE_USER,
    },
    image: {
        type: String,
        default: null,
    },
    language: {
        type: String,
        default: language.ES,
    },
    google: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        required: [true, constants.errorCodes.GENERIC_ERROR],
    },
    state: {
        type: String,
        enum: {
            values: [ constants.strings.STATE_PENDING, constants.strings.STATE_OK, constants.strings.STATE_DELETED ],
            message: constants.errorCodes.USER_STATE_NOT_VALID,
        },
        default: constants.strings.STATE_PENDING,
    }
});

// Edit the toJSON method (in this case, remove the hashedPassword variable from the user).
userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    delete userObject.hashedPassword;

    return userObject;
}

// Add unique validation.
userSchema.plugin(uniqueValidator, { message: 'user_{PATH}_exists' });

module.exports = mongoose.model(constants.models.USER, userSchema);