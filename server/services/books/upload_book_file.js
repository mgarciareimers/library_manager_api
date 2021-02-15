/**
* Author: mgarciareimers
* Date: 15/02/2021
* 
* Description: Method that uploads a book file.
*/

const path = require('path');
const fs = require('fs');
const { v5: uuidV5 } = require('uuid');

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Book = require('../../models/book');

const uploadBookFile = async (req, res) => {
    const { id } = req.body;
    const languageCode = req.headers.language;
    
    if (req.files === undefined || req.files === null || Object.keys(req.files).length === 0 || req.files.file === undefined || req.files.file === null) {
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_FILE_NOT_VALID), book: null });
    }

    const { file } = req.files;

    // Validate file extension.
    const extension = utils.getExtensionByFilename(file.name);
    
    if (extension !== constants.strings.EXTENSION_PDF) {
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_FILE_NOT_VALID), book: null });
    }

    // Check if selected book exists in database.
    const findOriginalBookPromise = await new Promise(resolve => Book.findById(id, (error, bookDB) => resolve({ error: error, bookDB: bookDB })));

    if (findOriginalBookPromise.error !== undefined && findOriginalBookPromise.error !== null) {
        utils.logError(findOriginalBookPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_BOOK), book: null });
    } else if (findOriginalBookPromise.bookDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.BOOK_NOT_FOUND), book: null });
    }
    
    const fileName = `${ uuidV5(Date.now().toString() + utils.generateRandomString(constants.numbers.UPLOAD_FILE_RANDOM_STRING_LENGTH), process.env.APP_UUID) }.${ extension }`;
    const uploadPath = path.join(__dirname, '../../../uploads/books/', fileName);
    
    // Save file.
    const saveFilePromise = await new Promise(resolve => file.mv(uploadPath, (error) => resolve({ error: error })));
    
    if (saveFilePromise.error !== undefined && saveFilePromise.error !== null) {
        const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPLOAD_BOOK_FILE : error.errors[Object.keys(error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPLOAD_BOOK_FILE ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), book: null });
    }

    // Update file path in book.
    const updatePromise = await new Promise(resolve => Book.findByIdAndUpdate(id, { file: fileName }, { new: true, runValidators: true }, (error, bookDB) => resolve({ error: error, bookDB: bookDB })))

    if (updatePromise.error !== undefined && updatePromise.error !== null) {
        const errorCode = updatePromise.error.errors === undefined || updatePromise.error.errors === null || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === undefined || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPLOAD_BOOK_FILE : updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);

        // In case of error, remove file.
        try { fs.unlinkSync(uploadPath); } 
        catch(e) {}

        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPLOAD_BOOK_FILE ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), book: null });
    } 

    // In case of error, remove file.
    try { fs.unlinkSync(path.join(__dirname, '../../../uploads/books/', findOriginalBookPromise.bookDB.file)); } 
    catch(e) {}
    
    return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPLOAD_BOOK_FILE), book: updatePromise.bookDB });
}

module.exports = uploadBookFile;