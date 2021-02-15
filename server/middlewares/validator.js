/**
* Author: mgarciareimers
* Date: 15/02/2021
* 
* Description: Methods that validate the user fields.
*/

const { body, validationResult } = require('express-validator');

const constants = require('../commons/constants');
const language = require('../language');

// Method that applies create user validation rules.
const applyCreateUserValidationRules = () => {
    return [
        body(constants.strings.EMAIL, constants.errorCodes.USER_EMAIL_NOT_VALID).isEmail(),
        body(constants.strings.NAME, constants.errorCodes.USER_NAME_REQUIRED).not().isEmpty(),
        body(constants.strings.SURNAME, constants.errorCodes.USER_SURNAME_REQUIRED).not().isEmpty(),
    ];
}

// Method that applies sign up validation rules.
const applySignUpValidationRules = () => {
    return [
        body(constants.strings.EMAIL, constants.errorCodes.USER_EMAIL_NOT_VALID).isEmail(),
        body(constants.strings.NAME, constants.errorCodes.USER_NAME_REQUIRED).not().isEmpty(),
        body(constants.strings.SURNAME, constants.errorCodes.USER_SURNAME_REQUIRED).not().isEmpty(),
        body(constants.strings.PASSWORD, constants.errorCodes.USER_PASSWORD_REQUIRED).isLength({ min: constants.numbers.PASSWORD_MIN_LENGTH }),
    ];
}

// Method that checks if the validations are ok.
const validate = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: language.getValue(req.headers.language, errors.array()[0].msg), user: null });
    }

    next();
}

module.exports = {
    applyCreateUserValidationRules,
    applySignUpValidationRules,

    validate,
}