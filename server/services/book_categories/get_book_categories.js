/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Method that gets all book categories (pagination included).
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const mongoose = require('mongoose');

const BookCategory = require('../../models/book_category');

const getBookCategories = async (req, res) => {
    const languageCode = req.headers.language;

    const pageNumber = req.query.pageNumber === undefined || req.query.pageNumber === null || isNaN(parseInt(req.query.pageNumber)) || parseInt(req.query.pageNumber) < constants.numbers.GET_DOCUMENT_FIRST_PAGE ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.pageNumber);
    const limit = req.query.limit === undefined || req.query.limit === null || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0 ? constants.numbers.DEFAULT_GET_BOOK_CATEGORIES_LIMIT : parseInt(req.query.limit);
    const booksPageNumber = req.query.booksPageNumber === undefined || req.query.booksPageNumber === null || isNaN(parseInt(req.query.booksPageNumber)) || parseInt(req.query.booksPageNumber) < 0 ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.booksPageNumber);
    const categoriesPageNumber = req.query.categoriesPageNumber === undefined || req.query.categoriesPageNumber === null || isNaN(parseInt(req.query.categoriesPageNumber)) || parseInt(req.query.categoriesPageNumber) < 0 ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.categoriesPageNumber);
    
    const { bookId, categoryId } = req.query;

    const filterObject = { 
        book: bookId === undefined || bookId === null || bookId.length <= 0 ? { $ne: null } : mongoose.Types.ObjectId(bookId),
        category: categoryId === undefined || categoryId === null || categoryId.length <= 0 ? { $ne: null } : mongoose.Types.ObjectId(categoryId),
    }; 

    // Get list of book categories. If book id is specified, get all categories of the book. Else if category id is given, get all books associated to that category.
    let query = BookCategory.find(filterObject).limit(limit).skip((pageNumber - 1) * limit);

    if (bookId !== undefined && bookId !== null && bookId.length > 0) {
        query = query.populate({
            path: constants.models.CATEGORY.toLowerCase(),
            options: {
                limit: constants.numbers.DEFAULT_GET_CATEGORIES_LIMIT,
                sort: constants.models.IDENTIFIER,
                skip: (categoriesPageNumber - 1) * limit
            },
        });
    } else if (categoryId !== undefined && categoryId !== null && categoryId.length > 0) {
        query = query.populate({
            path: constants.models.BOOK.toLowerCase(),
            options: {
                limit: constants.numbers.DEFAULT_GET_BOOKS_LIMIT,
                sort: constants.models.NAME,
                skip: (booksPageNumber - 1) * limit
            }
        });
    }

    // Apply query.
    query.exec((error, bookCategoriesDB) => {
        if (error) {
            utils.logError(constants.errorCodes.GENERIC_ERROR_GET_BOOK_CATEGORIES);
            return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_BOOK_CATEGORIES), bookCategories: null });
        } 

        BookCategory.countDocuments(filterObject, (error, total) => {
            if (error) {
                utils.logError(constants.errorCodes.GENERIC_ERROR_GET_BOOK_CATEGORIES);
                return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_BOOK_CATEGORIES), bookCategories: null });
            } 

            return res.status(200).json({ success: true, message: null, total: total, count: bookCategoriesDB.length, bookCategories: bookCategoriesDB });
        });
    });
}

module.exports = getBookCategories;