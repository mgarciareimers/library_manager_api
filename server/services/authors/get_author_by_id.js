/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Method that gets an author by its id.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Author = require('../../models/author');

const getAuthorById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    // Check if author exists in database.
    Author.findById(id, (error, authorDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_GET_AUTHOR_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_GET_AUTHOR_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), author: null });
        } else if (authorDB === undefined || authorDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.AUTHOR_NOT_FOUND), author: null });
        }

        return res.status(200).json({ success: true, message: null, author: authorDB });
    })
}

module.exports = getAuthorById;