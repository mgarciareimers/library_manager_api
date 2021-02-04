/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: Methods that verify the authentication token.
*/

const jwt = require('jsonwebtoken');

const constants = require('../commons/constants');
const language = require('../language');

const User = require('../models/user');

// Method that verifies the token.
const verifyToken = (req, res, next) => {
    const { token } = req.headers;
    const languageCode = req.headers.language;

    // Verify jwt.
    jwt.verify(token, process.env.JWT_SIGN_SEED, async (error, decoded) => {
        if (error !== undefined && error !== null || decoded.user === undefined || decoded.user === null) {
            return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_AUTHORIZED_CREDENTIALS) });
        }
        
        // Check if user exists in database.
        const findPromise = await new Promise(resolve => User.findById(decoded.user._id, (error, userDB) => resolve({ error: error, userDB: userDB })));

        if (findPromise.error !== undefined && findPromise.error !== null || findPromise.userDB === undefined || findPromise.userDB === null) {
            return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_AUTHORIZED_CREDENTIALS) });
        } else if (findPromise.userDB.state === constants.strings.STATE_PENDING) {
            return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_NOT_VERIFIED) });
        } else if (findPromise.userDB.state === constants.strings.STATE_DELETED) {
            return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_DELETED_NOT_AUTHORIZED) });
        }

        // Add user to the request object.
        req.user = findPromise.userDB;

        next();
    });
}

// Method that verifies if the user is an admin.
const verifyAdminRole = (req, res, next) => {
    const languageCode = req.headers.language;
    const { user } = req;

    if (user.role !== constants.strings.ROLE_ADMIN) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_AUTHORIZED) });
    }

    next();
}

module.exports = {
    verifyToken,
    verifyAdminRole,
}