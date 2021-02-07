/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Method that gets all authors (pagination included).
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Author = require('../../models/author');

const getAuthors = async (req, res) => {
    const languageCode = req.headers.language;

    const pageNumber = req.query.pageNumber === undefined || req.query.pageNumber === null || isNaN(parseInt(req.query.pageNumber)) || parseInt(req.query.pageNumber) < constants.numbers.GET_DOCUMENT_FIRST_PAGE ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.pageNumber);
    const limit = req.query.limit === undefined || req.query.limit === null || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0 ? constants.numbers.DEFAULT_GET_AUTHORS_LIMIT : parseInt(req.query.limit);
    const { name, surname, state } = req.query;

    const filterObject = { 
        name: new RegExp(name === undefined || name === null ? constants.strings.EMPTY_STRING : name, 'i'), 
        surname: new RegExp(surname === undefined || surname === null ? constants.strings.EMPTY_STRING : surname, 'i'), 
        state: new RegExp(state === undefined || state === null || req.user.role !== constants.strings.ROLE_ADMIN ? constants.strings.EMPTY_STRING : state, 'i'), 
    }; 

    // Get list of authors.
    Author.find(filterObject).limit(limit).skip((pageNumber - 1) * limit).exec((error, auhorsDB) => {
        if (error) {
            utils.logError(constants.errorCodes.GENERIC_ERROR_GET_AUTHORS);
            return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_AUTHORS), authors: null });
        } 

        Author.countDocuments(filterObject, (error, total) => {
            if (error) {
                utils.logError(constants.errorCodes.GENERIC_ERROR_GET_AUTHORS);
                return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_AUTHORS), authors: null });
            } 

            return res.status(200).json({ success: true, message: null, total: total, count: auhorsDB.length, authors: auhorsDB });
        });
    });
}

module.exports = getAuthors;