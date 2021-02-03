/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Method that creates a user.
*/

const bcrypt = require('bcrypt');
const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const createUser = (req, res) => {
    const { body } = req;
    const languageCode = req.headers.language;

    if (body.google !== undefined && body.google !== null && (typeof body.google) !== 'boolean') {
        utils.logError(constants.errorCodes.USER_GOOGLE_FORMAT_NOT_VALID);
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_GOOGLE_FORMAT_NOT_VALID), user: null });
    }
    
    const user = new User({
        name: body.name, 
        surname: body.surname, 
        username: body.username, 
        email: body.email, 
        hashedPassword: bcrypt.hashSync(utils.generateRandomString(constants.numbers.RANDOM_PASSWORD_LENGTH), constants.numbers.HASH_SALT_OR_ROUNDS), 
        role: body.role, 
        google: body.google, 
        state: body.state, 
    });

    user.save((error, userDB) => {
       if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? null : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === undefined || errorCode === null ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), user: null });
       } 

       return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_USER), user: userDB });
    });
}

module.exports = createUser;