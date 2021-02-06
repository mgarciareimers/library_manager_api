/**
* Author: mgarciareimers
* Date: 06/02/2021
* 
* Description: Method that verifies the account of the user.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const verifyAccount = async (req, res) => {
    const languageCode = req.params.language;
    const { verificationToken } = req.params;

    // Validate token.
    if (verificationToken === undefined || verificationToken === null) {
        return res.status(500).render('account_verification', { title : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TITLE_GENERAL_ERROR), message : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TEXT_GENERAL_ERROR) });
    }

    // Check if user exists in database.
    const findPromise = await new Promise(resolve => User.findOne({ verificationToken: verificationToken }, (error, userDB) => resolve({ error: error, userDB: userDB })));
        
    if (findPromise.error !== undefined && findPromise.error !== null || findPromise.userDB === undefined || findPromise.userDB === null || findPromise.userDB.state === constants.strings.STATE_DELETED) {
        return res.status(500).render('account_verification', { title : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TITLE_GENERAL_ERROR), message : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TEXT_GENERAL_ERROR) });
    } else if (findPromise.userDB.state === constants.strings.STATE_OK) {
        return res.status(500).render('account_verification', { title : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TITLE_GENERAL_ERROR), message : language.getValue(languageCode, constants.errorCodes.ACCOUNT_ALREADY_VERIFIED) });
    }

    // Update state.
    User.findByIdAndUpdate(findPromise.userDB._id, { state: constants.strings.STATE_OK }, { new: true, runValidators: true }, (error, userDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.ACCOUNT_VERIFICATION_TEXT_GENERAL_ERROR : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(500).render('account_verification', { title : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TITLE_GENERAL_ERROR), message : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TEXT_GENERAL_ERROR) });
        } else if (userDB === undefined || userDB === null) {
            return res.status(500).render('account_verification', { title : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TITLE_GENERAL_ERROR), message : language.getValue(languageCode, constants.errorCodes.ACCOUNT_VERIFICATION_TEXT_GENERAL_ERROR) });
        }

        return res.status(200).render('account_verification', { title : language.getValue(languageCode, constants.stringCodes.SUCCESS_ACCOUNT_VERIFIED_TITLE), message : language.getValue(languageCode, constants.stringCodes.SUCCESS_ACCOUNT_VERIFIED_TEXT) });
    });
}

module.exports = verifyAccount;