/**
* Author: mgarciareimers
* Date: 11/02/2021
* 
* Description: Method that creates a book borrow.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const mongoose = require('mongoose');

const BookBorrow = require('../../models/book_borrow');

const createBookBorrow = async (req, res) => {
    const { body } = req;
    const languageCode = req.headers.language;

    // Check if book borrow exists in database.
    const filterObject = { user: null, book: null };

    try {
        filterObject.user = body.user === undefined || body.user === null || body.user.length <= 0 ? null : mongoose.Types.ObjectId(body.user);
        filterObject.book = body.book === undefined || body.book === null || body.book.length <= 0 ? null : mongoose.Types.ObjectId(body.book);
    } catch(e) {}
    
    const findPromise = await new Promise(resolve => BookBorrow.findOne(filterObject, (error, bookBorrowDB) => resolve({ error: error, bookBorrowDB: bookBorrowDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_BOOK_BORROW), bookBorrow: null });
    } else if (findPromise.bookBorrowDB !== null) {
        return res.status(409).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_BORROW_ALREADY_EXISTS), bookBorrow: null });
    }
    
    const bookBorrow = new BookBorrow({
        user: body.user,
        book: body.book,
        currentPage: constants.numbers.ZERO,
        state: constants.strings.STATE_OK, 
    });

    bookBorrow.save(async (error, bookBorrowDB) => {
        if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_CREATE_BOOK_BORROW : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_CREATE_BOOK_BORROW ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), bookBorrow: null });
        } 

        return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_BOOK_BORROW), bookBorrow: bookBorrowDB });
    });
}

module.exports = createBookBorrow;