/**
* Author: mgarciareimers
* Date: 02/02/2021
* 
* Description: Method that updates a user.
*/

const _ = require('underscore');
const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const updateUser = async (req, res) => {
    const body = _.pick(req.body, [ 'name', 'surname', 'email', 'role', 'state' ]);
    const { id } = req.params;
    const languageCode = req.headers.language;

    // Check if user is authorized (admin or own user);
    if (id !== req.user._id && req.user.role !== constants.strings.ROLE_ADMIN) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_AUTHORIZED) });
    }
    
    // Check if user exists in database.
    const findPromise = await new Promise(resolve => User.findById(id, (error, userDB) => resolve({ error: error, userDB: userDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_USER), user: null });
    } else if (findPromise.userDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_FOUND), user: null });
    }

    // Update user.
    const updatePromise = await new Promise(resolve => User.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, userDB) => resolve({ error: error, userDB: userDB })))

    if (updatePromise.error !== undefined && updatePromise.error !== null) {
        const errorCode = updatePromise.error.errors === undefined || updatePromise.error.errors === null || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === undefined || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPDATE_USER : updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPDATE_USER ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), user: null });
    } 
   
   return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPDATE_USER), user: updatePromise.userDB });
}

module.exports = updateUser;