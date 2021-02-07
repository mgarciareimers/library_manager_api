/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Method that deletes an author by its id.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Author = require('../../models/author');

const deleteAuthorById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    Author.findByIdAndRemove(id, (error, authorDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_DELETE_AUTHOR_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_DELETE_USER_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), author: null });
        } else if (authorDB === undefined || authorDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.AUTHOR_NOT_FOUND), author: null });
        }

        return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_DELETE_AUTHOR_BY_ID), author: authorDB });
    });
}

module.exports = deleteAuthorById;