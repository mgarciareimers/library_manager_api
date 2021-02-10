/**
* Author: mgarciareimers
* Date: 08/02/2021
* 
* Description: Method that updates a book.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Book = require('../../models/book');

const updateBook = async (req, res) => {
    const { body } = req;
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    // Check if selected book exists in database.
    const findOriginalBookPromise = await new Promise(resolve => Book.findById(id, (error, bookDB) => resolve({ error: error, bookDB: bookDB })));

    if (findOriginalBookPromise.error !== undefined && findOriginalBookPromise.error !== null) {
        utils.logError(findOriginalBookPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_BOOK), book: null });
    } else if (findOriginalBookPromise.bookDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_NOT_FOUND), book: null });
    }

    // Check if book (different that the one to update) with the specified characteristics exists in database.
    const filterObject = {
        title: body.title === undefined || body.title === null ? findOriginalBookPromise.bookDB.title : new RegExp(body.title, 'i'),
        subtitle: body.subtitle === undefined || body.subtitle === null ? findOriginalBookPromise.bookDB.subtitle : new RegExp(body.subtitle, 'i'),
        originalTitle: body.originalTitle === undefined || body.originalTitle === null ? findOriginalBookPromise.bookDB.originalTitle : new RegExp(body.originalTitle, 'i'), 
        originalSubtitle: body.originalSubtitle === undefined || body.originalSubtitle === null ? findOriginalBookPromise.bookDB.originalSubtitle : new RegExp(body.originalSubtitle, 'i'),
        author: body.author === undefined || body.author === null || body.author.length <= 0 ? findOriginalBookPromise.bookDB.author : body.author,
        publicationYear: body.publicationYear === undefined || body.publicationYear === null ? findOriginalBookPromise.bookDB.publicationYear : body.publicationYear, 
        editionNumber: body.editionNumber === undefined || body.editionNumber === null ? findOriginalBookPromise.bookDB.editionNumber : body.editionNumber, 
        language: body.language === undefined || body.language === null ? findOriginalBookPromise.bookDB.language : new RegExp(body.language, 'i'),
    };

    const findOtherBookPromise = await new Promise(resolve => Book.findOne(filterObject, (error, bookDB) => resolve({ error: error, bookDB: bookDB })));

    if (findOtherBookPromise.error !== undefined && findOtherBookPromise.error !== null) {
        utils.logError(findOtherBookPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_BOOK), book: null });
    } else if (findOtherBookPromise.bookDB !== null && findOtherBookPromise.bookDB.author.toString() !== findOriginalBookPromise.bookDB.author.toString()) {
        return res.status(409).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_ALREADY_EXISTS), book: null });
    }

    // Update book.
    const updatePromise = await new Promise(resolve => Book.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, bookDB) => resolve({ error: error, bookDB: bookDB })))

    if (updatePromise.error !== undefined && updatePromise.error !== null) {
        const errorCode = updatePromise.error.errors === undefined || updatePromise.error.errors === null || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === undefined || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPDATE_BOOK : updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPDATE_BOOK ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), book: null });
    } 
   
   return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPDATE_BOOK), author: updatePromise.bookDB });
}

module.exports = updateBook;