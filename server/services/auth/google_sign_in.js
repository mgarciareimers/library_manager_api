/**
* Author: mgarciareimers
* Date: 05/02/2021
* 
* Description: Method that logs a user in via google token.
*/

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');
const mailer = require('../../commons/mailer');

const User = require('../../models/user');

// Method that logs the user in.
const googleSignIn = async (req, res) => {
    const { token } = req.body;
    const languageCode = req.headers.language;
    
    const googleUser = await verifyGoogleToken(token, languageCode);

    if (googleUser === null) {
        return res.status(403).json({ success: true, message: language.getValue(languageCode, constants.errorCodes.GOOGLE_USER_NOT_VALID) });
    }

    // Check if user exists in database.
    const findPromise = await new Promise(resolve => User.findOne({ email: googleUser.email.toLowerCase() }, (error, userDB) => resolve({ error: error, userDB: userDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_USER) });
    } else if (findPromise.userDB !== null && findPromise.userDB.state === constants.strings.STATE_PENDING) {
        // User did not verify the account.
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_NOT_VERIFIED) });
    } else if (findPromise.userDB !== null && findPromise.userDB.state === constants.strings.STATE_DELETED) {
        // User deleted previously the account.
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.ACCOUNT_DELETED_NOT_AUTHORIZED) });
    } else if (findPromise.userDB !== null && !findPromise.userDB.google) {
        // User created previously the account but not via Google.
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GOOGLE_USER_NORMAL_EXISTS) });
    } else if (findPromise.userDB !== null && findPromise.userDB.google) {
        // User created previously the account via Google.
        const token = jwt.sign({ user: findPromise.userDB }, process.env.JWT_SIGN_SEED);
        return res.status(200).json({ success: true, message: null, token: token });
    }

    // Create user.
    const user = new User({
        name: googleUser.name, 
        surname: googleUser.surname, 
        email: googleUser.email.toLowerCase(), 
        hashedPassword: bcrypt.hashSync(utils.generateRandomString(constants.numbers.RANDOM_PASSWORD_LENGTH), constants.numbers.HASH_SALT_OR_ROUNDS), 
        image: googleUser.image,
        language: languageCode, 
        google: googleUser.google,
        verificationToken: bcrypt.hashSync(googleUser.email + utils.generateRandomString(constants.numbers.RANDOM_VERIFICATION_TOKEN_LENGTH), constants.numbers.HASH_SALT_OR_ROUNDS).replace(constants.strings.SLASH, constants.strings.EMPTY_STRING),
    });

    user.save(async (error, userDB) => {
        if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? null : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === undefined || errorCode === null ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode) });
        } 

        // Send email.
        const emailContent = mailer.getWelcomeGoogleEmailContent(languageCode, userDB.name, userDB.verificationToken);

        if (!await mailer.sendEmail(mailer.NO_REPLY_MAIL, userDB.email, language.getValue(languageCode, constants.stringCodes.WELCOME_SUBJECT), emailContent.html, emailContent.plainText)) {
            await User.deleteOne({ email: userDB.email });
            return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_CREATE_ACCOUNT), user: null }); 
        }

        return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_USER) });
    });
}

// Method that verifies the google token.
const verifyGoogleToken = async (token, languageCode) => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();

        return { name: payload.given_name, surname: payload.family_name, email: payload.email, image: payload.picture, language: languageCode, google: true };
    } catch(e) {
        return null;
    }
}

module.exports = googleSignIn;