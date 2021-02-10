/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Method that creates a book category.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const mongoose = require('mongoose');

const BookCategory = require('../../models/book_category');

const createBookCategory = async (req, res) => {
    const { body } = req;
    const languageCode = req.headers.language;

    // Check if book category exists in database.
    const filterObject = {
        book: body.book === undefined || body.book === null || body.book.length <= 0 ? null : mongoose.Types.ObjectId(body.book),
        category: body.category === undefined || body.category === null || body.category.length <= 0 ? null : mongoose.Types.ObjectId(body.category),
    };

    const findPromise = await new Promise(resolve => BookCategory.findOne(filterObject, (error, bookCategoryDB) => resolve({ error: error, bookCategoryDB: bookCategoryDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_BOOK_CATEGORY), bookCategory: null });
    } else if (findPromise.bookCategoryDB !== null) {
        return res.status(409).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_CATEGORY_ALREADY_EXISTS), bookCategory: null });
    }
    
    const bookCategory = new BookCategory({
        book: body.book,
        category: body.category,
        state: constants.strings.STATE_OK, 
    });

    bookCategory.save(async (error, bookCategoryDB) => {
        if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_CREATE_BOOK_CATEGORY : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_CREATE_BOOK_CATEGORY ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), bookCategory: null });
        } 

        return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_BOOK_CATEGORY), bookCategory: bookCategoryDB });
    });
}

module.exports = createBookCategory;