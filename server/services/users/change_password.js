/**
* Author: mgarciareimers
* Date: 06/02/2021
* 
* Description: Method that changes the password of the user.
*/

const bcrypt = require('bcrypt');
const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const suspendAccountById = async (req, res) => {
    const languageCode = req.headers.language;
    const { oldPassword, newPassword } = req.body;

    if (oldPassword === undefined || oldPassword === null || oldPassword.length < constants.numbers.PASSWORD_MIN_LENGTH) {
        return res.status(400).json({ success: false, message: language.getValue(constants.errorCodes.USER_PASSWORD_REQUIRED, constants.errorCodes.OLD_PASSWORD_NOT_VALID).replace(constants.stringCodes.REPLACE_STRING_CODE, constants.numbers.PASSWORD_MIN_LENGTH) });
    } else if (newPassword === undefined || newPassword === null || newPassword.length < constants.numbers.PASSWORD_MIN_LENGTH) {
        return res.status(400).json({ success: false, message: language.getValue(constants.errorCodes.USER_PASSWORD_REQUIRED, constants.errorCodes.NEW_PASSWORD_NOT_VALID).replace(constants.stringCodes.REPLACE_STRING_CODE, constants.numbers.PASSWORD_MIN_LENGTH).replace(constants.stringCodes.REPLACE_STRING_CODE, constants.numbers.PASSWORD_MIN_LENGTH) });
    } else if (req.user.google) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_GOOGLE_LOGIN_NOT_AUTHORIZED) });
    }

    // Check if user exists in database.
    const findPromise = await new Promise(resolve => User.findOne({ email: req.user.email }, (error, userDB) => resolve({ error: error, userDB: userDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_USER) });
    } else if (findPromise.userDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_FOUND) });
    }

    // Validate password.
    if (!bcrypt.compareSync(oldPassword, findPromise.userDB.hashedPassword)) {
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.OLD_PASSWORD_NOT_VALID) });
    }

    // Update password.
    const hashedNewPassword = bcrypt.hashSync(newPassword, constants.numbers.HASH_SALT_OR_ROUNDS);

    User.findByIdAndUpdate(req.user._id, { hashedNewPassword: hashedNewPassword }, { new: true, runValidators: true }, (error, userDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPDATE_PASSWORD : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_DELETE_USER_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode) });
        } else if (userDB === undefined || userDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_FOUND) });
        }

        return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPDATE_PASSWORD) });
    });
}

module.exports = suspendAccountById;