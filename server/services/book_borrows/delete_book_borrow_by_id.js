/**
* Author: mgarciareimers
* Date: 12/02/2021
* 
* Description: Method that deletes a book borrow by its id.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const BookBorrow = require('../../models/book_borrow');

const deleteBookBorrowById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    BookBorrow.findByIdAndRemove(id, (error, bookBorrowDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_DELETE_BOOK_BORROW_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_DELETE_BOOK_BORROW_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), bookBorrow: null });
        } else if (bookBorrowDB === undefined || bookBorrowDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_BORROW_NOT_FOUND_ADMIN), bookBorrow: null });
        }

        return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_DELETE_BOOK_BORROW_BY_ID), bookBorrow: bookBorrowDB });
    });
}

module.exports = deleteBookBorrowById;