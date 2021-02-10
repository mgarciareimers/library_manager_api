/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Method that creates a book.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const mongoose = require('mongoose');

const Book = require('../../models/book');

const createBook = async (req, res) => {
    const { body } = req;
    const languageCode = req.headers.language;

    // Check if book exists in database.
    const filterObject = {
        title: new RegExp(body.title === undefined || body.title === null ? constants.strings.EMPTY_STRING : `^${ body.title }$`, 'i'),
        subtitle: new RegExp(body.subtitle === undefined || body.subtitle === null ? constants.strings.EMPTY_STRING : `^${ body.subtitle }$`, 'i'),
        originalTitle: new RegExp(body.originalTitle === undefined || body.originalTitle === null ? constants.strings.EMPTY_STRING : `^${ body.originalTitle }$`, 'i'), 
        originalSubtitle: new RegExp(body.originalSubtitle === undefined || body.originalSubtitle === null ? constants.strings.EMPTY_STRING : `^${ body.originalSubtitle }$`, 'i'),
        author: body.author === undefined || body.author === null || body.author.length <= 0 ? null : mongoose.Types.ObjectId(body.author),
        publicationYear: body.publicationYear, 
        editionNumber: body.editionNumber, 
        language: body.language === undefined || body.language === null ? language.ES : new RegExp(`^${ body.language }$`, 'i'),
    };

    const findPromise = await new Promise(resolve => Book.findOne(filterObject, (error, bookDB) => resolve({ error: error, bookDB: bookDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_BOOK), book: null });
    } else if (findPromise.bookDB !== null) {
        return res.status(409).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_ALREADY_EXISTS), book: null });
    }
    
    const book = new Book({
        title: body.title, 
        subtitle: body.subtitle, 
        originalTitle: body.originalTitle, 
        originalSubtitle: body.originalSubtitle, 
        author: body.author,  
        publicationYear: body.publicationYear,  
        editionNumber: body.editionNumber,
        file: null,
        language: body.language,
        state: constants.strings.STATE_OK, 
    });

    book.save(async (error, bookDB) => {
        if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_CREATE_BOOK : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_CREATE_BOOK ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), book: null });
        } 

        return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_BOOK), book: bookDB });
    });
}

module.exports = createBook;