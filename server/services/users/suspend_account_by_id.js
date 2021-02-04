/**
* Author: mgarciareimers
* Date: 03/02/2021
* 
* Description: Method that suspends the account by deleting 'logically' a user (change state to 'deleted').
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const suspendAccountById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;

    // Check if user is authorized (admin or own user);
    if (id !== req.user._id && req.user.role !== constants.strings.ROLE_ADMIN) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_AUTHORIZED) });
    }

    User.findByIdAndUpdate(id, { state: constants.strings.STATE_DELETED }, { new: true, runValidators: true }, (error, userDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_DELETE_USER_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_DELETE_USER_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), user: null });
        } else if (userDB === undefined || userDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_FOUND), user: null });
        }

        return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_SUSPEND_ACCOUNT_BY_ID), user: userDB });
    });
}

module.exports = suspendAccountById;