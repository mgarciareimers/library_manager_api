/**
* Author: mgarciareimers
* Date: 08/02/2021
* 
* Description: Method that gets all books (pagination included).
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const mongoose = require('mongoose');

const Book = require('../../models/book');

const getBooks = async (req, res) => {
    const languageCode = req.headers.language;

    const pageNumber = req.query.pageNumber === undefined || req.query.pageNumber === null || isNaN(parseInt(req.query.pageNumber)) || parseInt(req.query.pageNumber) < constants.numbers.GET_DOCUMENT_FIRST_PAGE ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.pageNumber);
    const limit = req.query.limit === undefined || req.query.limit === null || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0 ? constants.numbers.DEFAULT_GET_BOOKS_LIMIT : parseInt(req.query.limit);
    const { title, subtitle, publicationYear, editionNumber, authorId, state } = req.query;
    const bookLanguage = req.query.language;

    const filterObject = { 
        $and: [
            { $or: [
                { title: new RegExp(title === undefined || title === null ? constants.strings.EMPTY_STRING : title, 'i') }, 
                { originalTitle: new RegExp(title === undefined || title === null ? constants.strings.EMPTY_STRING : title, 'i') }
            ]}, 
            { $or: [
                { subtitle: new RegExp(subtitle === undefined || subtitle === null ? constants.strings.EMPTY_STRING : subtitle, 'i') }, 
                { originalSubtitle: new RegExp(subtitle === undefined || subtitle === null ? constants.strings.EMPTY_STRING : subtitle, 'i') }
            ]}, 
            { publicationYear: publicationYear === undefined || publicationYear === null || publicationYear.length <= 0 ? { $gt: 0 } : publicationYear },  
            { editionNumber: editionNumber === undefined || editionNumber === null || editionNumber.length <= 0 ? { $gt: 0 } : editionNumber },   
            { language: bookLanguage === undefined || bookLanguage === null ? null : new RegExp(bookLanguage, 'i') }, 
            { state: state === undefined || state === null || req.user.role !== constants.strings.ROLE_ADMIN || req.user.role !== constants.strings.ROLE_ADMIN && state.length <= 0 ? constants.strings.STATE_OK : new RegExp(state, 'i') },
            { author: authorId === undefined || authorId === null || authorId.length <= 0 ? { $ne: null } : mongoose.Types.ObjectId(authorId), }
        ]
    }; 

    // Get list of books.
    Book.find(filterObject).sort(constants.models.TITLE).limit(limit).skip((pageNumber - 1) * limit).populate(constants.models.AUTHOR.toLowerCase()).exec((error, booksDB) => {
        if (error) {
            utils.logError(constants.errorCodes.GENERIC_ERROR_GET_BOOKS);
            return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_BOOKS), books: null });
        } 

        Book.countDocuments(filterObject, (error, total) => {
            if (error) {
                utils.logError(constants.errorCodes.GENERIC_ERROR_GET_BOOKS);
                return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_BOOKS), books: null });
            } 

            return res.status(200).json({ success: true, message: null, total: total, count: booksDB.length, books: booksDB });
        });
    });
}

module.exports = getBooks;