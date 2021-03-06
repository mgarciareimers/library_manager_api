/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Method that gets a book category by its id.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const BookCategory = require('../../models/book_category');

const getBookCategoryById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    // Check if book exists in database.
    BookCategory.findById(id).populate(constants.models.BOOK.toLowerCase()).populate(constants.models.CATEGORY.toLowerCase()).exec((error, bookCategoryDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_GET_BOOK_CATEGORY_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_GET_BOOK_CATEGORY_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), bookCategory: null });
        } else if (bookCategoryDB === undefined || bookCategoryDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_CATEGORY_NOT_FOUND), bookCategory: null });
        }

        return res.status(200).json({ success: true, message: null, bookCategory: bookCategoryDB });
    });
}

module.exports = getBookCategoryById;