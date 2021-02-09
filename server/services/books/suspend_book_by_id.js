/**
* Author: mgarciareimers
* Date: 09/02/2021
* 
* Description: Method that suspends a book by deleting it 'logically' (change state to 'deleted').
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Book = require('../../models/book');

const suspendBookById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;

    Book.findByIdAndUpdate(id, { state: constants.strings.STATE_DELETED }, { new: true, runValidators: true }, (error, bookDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_DELETE_BOOK_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_DELETE_BOOK_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), book: null });
        } else if (bookDB === undefined || bookDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_NOT_FOUND), book: null });
        }

        return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_SUSPEND_BOOK_BY_ID), book: bookDB });
    });
}

module.exports = suspendBookById;