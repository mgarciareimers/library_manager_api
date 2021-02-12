/**
* Author: mgarciareimers
* Date: 11/02/2021
* 
* Description: Method that updates the current page of the book borrow.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const BookBorrow = require('../../models/book_borrow');

const updateBookBorrowPage = async (req, res) => {
    const { currentPage } = req.body;
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    // Check if selected book borrow exists in database.
    const findPromise = await new Promise(resolve => BookBorrow.findById(id).populate(constants.models.USER.toLowerCase()).exec((error, bookBorrowDB) => resolve({ error: error, bookBorrowDB: bookBorrowDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_BOOK_BORROW), bookBorrow: null });
    } else if (findPromise.bookBorrowDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_BORROW_NOT_FOUND), bookBorrow: null });
    } else if (findPromise.bookBorrowDB.user._id.toString() !== req.user._id.toString()) {
        return res.status(401).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_NOT_AUTHORIZED) });
    }

    // Update book borrow.
    const updatePromise = await new Promise(resolve => BookBorrow.findByIdAndUpdate(id, { currentPage: currentPage, modificationDate: new Date() }, { new: true, runValidators: true }, (error, bookBorrowDB) => resolve({ error: error, bookBorrowDB: bookBorrowDB })))

    if (updatePromise.error !== undefined && updatePromise.error !== null) {
        const errorCode = updatePromise.error.errors === undefined || updatePromise.error.errors === null || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === undefined || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPDATE_BOOK_BORROW_PAGE : updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPDATE_BOOK_BORROW_PAGE ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), bookBorrow: null });
    } 
   
   return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPDATE_BOOK_BORROW_PAGE), author: updatePromise.bookBorrowDB });
}

module.exports = updateBookBorrowPage;