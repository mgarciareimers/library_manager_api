/**
* Author: mgarciareimers
* Date: 03/02/2021
* 
* Description: Method that gets a user by its id.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const getUserById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    // Check if user exists in database.
    User.findById(id, (error, userDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_GET_USER_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_GET_USER_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), user: null });
        } else if (userDB === undefined || userDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_FOUND), user: null });
        }

        return res.status(200).json({ success: true, message: null, user: userDB });
    })
}

module.exports = getUserById;