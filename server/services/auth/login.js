/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: Method that logs a user in.
*/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const login = async (req, res) => {
    const { email, password } = req.body;
    const languageCode = req.headers.language;

    // Check if user exists in database.
    const findPromise = await new Promise(resolve => User.findOne({ email: email }, (error, userDB) => resolve({ error: error, userDB: userDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_USER), token: null });
    } else if (findPromise.userDB === null) {
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.INVALID_CREDENTIALS), token: null });
    } else if (findPromise.userDB.state === constants.strings.STATE_PENDING) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_NOT_VERIFIED) });
    } else if (findPromise.userDB.state === constants.strings.STATE_DELETED) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_DELETED_NOT_AUTHORIZED) });
    } else if (findPromise.userDB.google) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_GOOGLE_LOGIN_NOT_AUTHORIZED) });
    }

    // Validate password.
    if (!bcrypt.compareSync(password, findPromise.userDB.hashedPassword)) {
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.INVALID_CREDENTIALS), token: null });
    }

    const token = jwt.sign({ user: findPromise.userDB }, process.env.JWT_SIGN_SEED);

    return res.status(200).json({ success: true, message: null, token: token });
}

module.exports = login;