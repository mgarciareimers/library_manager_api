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
const mailer = require('../../commons/mailer');

const User = require('../../models/user');

const createUser = (req, res) => {
    const { body } = req;
    const languageCode = req.headers.language;

    if (body.google !== undefined && body.google !== null && (typeof body.google) !== 'boolean') {
        utils.logError(constants.errorCodes.USER_GOOGLE_FORMAT_NOT_VALID);
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_GOOGLE_FORMAT_NOT_VALID), user: null });
    }

    const password = utils.generateRandomString(constants.numbers.RANDOM_PASSWORD_LENGTH);
    
    const user = new User({
        name: body.name, 
        surname: body.surname,  
        email: body.email.toLowerCase(), 
        hashedPassword: bcrypt.hashSync(password, constants.numbers.HASH_SALT_OR_ROUNDS), 
        role: body.role,
        language: languageCode, 
        google: false, 
        verificationToken: bcrypt.hashSync(body.email + utils.generateRandomString(constants.numbers.RANDOM_VERIFICATION_TOKEN_LENGTH), constants.numbers.HASH_SALT_OR_ROUNDS).replace(constants.strings.SLASH, constants.strings.EMPTY_STRING),
        state: body.state, 
    });

    user.save(async (error, userDB) => {
        if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_CREATE_ACCOUNT : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_CREATE_ACCOUNT ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), user: null });
        } 

        // Send email.
        const emailContent = mailer.getWelcomeAdminCreatedEmailContent(languageCode, userDB.name, password, userDB.verificationToken);

        if (!await mailer.sendEmail(mailer.NO_REPLY_MAIL, userDB.email, language.getValue(languageCode, constants.stringCodes.WELCOME_SUBJECT), emailContent.html, emailContent.plainText)) {
           await User.deleteOne({ email: userDB.email });
           return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_CREATE_ACCOUNT), user: null }); 
        }

        return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_USER), user: userDB });
    });
}

module.exports = createUser;