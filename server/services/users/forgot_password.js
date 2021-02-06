/**
* Author: mgarciareimers
* Date: 06/02/2021
* 
* Description: Method that resets the password of the user.
*/

const bcrypt = require('bcrypt');
const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');
const mailer = require('../../commons/mailer');

const User = require('../../models/user');

const forgotPassword = async (req, res) => {
    const languageCode = req.headers.language;
    const { email } = req.body;

    // Check if user exists in database.
    const findPromise = await new Promise(resolve => User.findOne({ email: email }, (error, userDB) => resolve({ error: error, userDB: userDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_USER) });
    } else if (findPromise.userDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_FOUND) });
    } else if (findPromise.userDB.google) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_RESET_PASSWORD) });
    }

    // Update password.
    const password = utils.generateRandomString(constants.numbers.RANDOM_PASSWORD_LENGTH);
    const hashedPassword = bcrypt.hashSync(password, constants.numbers.HASH_SALT_OR_ROUNDS);

    User.findByIdAndUpdate(findPromise.userDB._id, { hashedPassword: hashedPassword }, { new: true, runValidators: true }, async (error, userDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_RESET_PASSWORD : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_RESET_PASSWORD ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode) });
        } else if (userDB === undefined || userDB === null) {
            return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_FORGOT_PASSWORD) });
        }

        // Send email.
        const emailContent = mailer.getForgotPasswordEmailContent(languageCode, userDB.name, password);

        if (!await mailer.sendEmail(mailer.NO_REPLY_MAIL, userDB.email, language.getValue(languageCode, constants.stringCodes.FORGOT_PASSWORD_SUBJECT), emailContent.html, emailContent.plainText)) {
           return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_RESET_PASSWORD), user: null }); 
        }

        return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_FORGOT_PASSWORD) });
    });
}

module.exports = forgotPassword;