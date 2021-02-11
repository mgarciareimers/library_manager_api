/**
* Author: mgarciareimers
* Date: 11/02/2021
* 
* Description: Method that gets all book borrows (pagination included).
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const mongoose = require('mongoose');

const BookBorrow = require('../../models/book_borrow');

const getBookBorrows = async (req, res) => {
    const languageCode = req.headers.language;

    const pageNumber = req.query.pageNumber === undefined || req.query.pageNumber === null || isNaN(parseInt(req.query.pageNumber)) || parseInt(req.query.pageNumber) < constants.numbers.GET_DOCUMENT_FIRST_PAGE ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.pageNumber);
    const limit = req.query.limit === undefined || req.query.limit === null || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0 ? constants.numbers.DEFAULT_GET_BOOK_BORROWS_LIMIT : parseInt(req.query.limit);
    const userPageNumber = req.query.userPageNumber === undefined || req.query.userPageNumber === null || isNaN(parseInt(req.query.userPageNumber)) || parseInt(req.query.userPageNumber) < 0 ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.userPageNumber);
    const booksPageNumber = req.query.booksPageNumber === undefined || req.query.booksPageNumber === null || isNaN(parseInt(req.query.booksPageNumber)) || parseInt(req.query.booksPageNumber) < 0 ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.booksPageNumber);

    const { userId, bookId } = req.query;

    // Prepare filter.
    const filterObject = { user: null, book: null };

    try {
        filterObject.user = body.userId === undefined || body.userId === null || body.userId.length <= 0 ? null : mongoose.Types.ObjectId(body.userId);
        filterObject.book = body.bookId === undefined || body.bookId === null || body.bookId.length <= 0 ? null : mongoose.Types.ObjectId(body.bookId);
    } catch(e) {}

    if (filterObject.user === null) {
        delete filterObject.user;
    }

    if (filterObject.book === null) {
        delete filterObject.book;
    }

    // Get list of book borrows. If book id is specified, get all users of the book. Else if user id is given, get all books associated to that user.
    let query = BookBorrow.find(filterObject).limit(limit).skip((pageNumber - 1) * limit);

    if (userId !== undefined && userId !== null && userId.length > 0) {
        query = query.populate({
            path: constants.models.BOOK.toLowerCase(),
            options: {
                limit: constants.numbers.DEFAULT_GET_BOOKS_LIMIT,
                sort: constants.models.NAME,
                skip: (booksPageNumber - 1) * limit
            }
        });
    } else if (bookId !== undefined && bookId !== null && bookId.length > 0) {
        query = query.populate({
            path: constants.models.USER.toLowerCase(),
            options: {
                limit: constants.numbers.DEFAULT_GET_USERS_LIMIT,
                sort: constants.models.IDENTIFIER,
                skip: (userPageNumber - 1) * limit
            },
        });
    }
    
    // Apply query.
    query.exec((error, bookBorrowsDB) => {
        if (error) {
            utils.logError(constants.errorCodes.GENERIC_ERROR_GET_BOOK_BORROWS);
            return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_BOOK_BORROWS), bookBorrows: null });
        } 

        BookBorrow.countDocuments(filterObject, (error, total) => {
            if (error) {
                utils.logError(constants.errorCodes.GENERIC_ERROR_GET_BOOK_BORROWS);
                return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_BOOK_BORROWS), bookBorrows: null });
            } 

            return res.status(200).json({ success: true, message: null, total: total, count: bookBorrowsDB.length, bookBorrows: bookBorrowsDB });
        });
    });
}

module.exports = getBookBorrows;