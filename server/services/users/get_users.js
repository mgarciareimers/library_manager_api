/**
* Author: mgarciareimers
* Date: 03/02/2021
* 
* Description: Method that gets all users (pagination included).
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const getUsers = async (req, res) => {
    const languageCode = req.headers.language;

    const pageNumber = req.query.pageNumber === undefined || req.query.pageNumber === null || isNaN(parseInt(req.query.pageNumber)) || parseInt(req.query.pageNumber) < constants.numbers.GET_DOCUMENT_FIRST_PAGE ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.pageNumber);
    const limit = req.query.limit === undefined || req.query.limit === null || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0 ? constants.numbers.DEFAULT_GET_USERS_LIMIT : parseInt(req.query.limit);
    const { email, state } = req.query;

    const filterObject = { 
        email: new RegExp(email === undefined || email === null ? constants.strings.EMPTY_STRING : email, 'i'), 
        state: new RegExp(state === undefined || state === null ? constants.strings.EMPTY_STRING : state, 'i'), 
    }; 

    // Get list of users.
    User.find(filterObject).limit(limit).skip((pageNumber - 1) * limit).exec((error, usersDB) => {
        if (error) {
            utils.logError(constants.errorCodes.GENERIC_ERROR_GET_USERS);
            return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_USERS), users: null });
        } 

        User.countDocuments(filterObject, (error, total) => {
            if (error) {
                utils.logError(constants.errorCodes.GENERIC_ERROR_GET_USERS);
                return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_USERS), users: null });
            } 

            return res.status(200).json({ success: true, message: null, total: total, count: usersDB.length, users: usersDB });
        });
    });
}

module.exports = getUsers;