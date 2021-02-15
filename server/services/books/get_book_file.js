/**
* Author: mgarciareimers
* Date: 15/02/2021
* 
* Description: Method that gets the file of a book.
*/

const fs = require('fs');
const path = require('path');

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');

const Book = require('../../models/book');

const getBookFile = async (req, res) => {
    const { id } = req.params;
    
    // Check if book exists in database.
    const findPromise = await new Promise(resolve => Book.findById(id, (error, bookDB) => resolve({ error: error, bookDB: bookDB })));
     
    if (findPromise.error !== undefined && findPromise.error !== null) {
        const errorCode = findPromise.error.errors === undefined || findPromise.error.errors === null || findPromise.error.errors[Object.keys(findPromise.error.errors)[0]].properties === undefined || findPromise.error.errors[Object.keys(findPromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_GET_BOOK_BY_ID : findPromise.error.errors[Object.keys(findPromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_GET_BOOK_BY_ID ? 500 : 400).sendFile(path.join(__dirname, '../../../assets/no_file.png'));
    } else if (findPromise.bookDB === undefined || findPromise.bookDB === null) {
        return res.status(404).sendFile(path.join(__dirname, '../../../assets/no_file.png'));
    }

    // Get file.
    const filePath = path.join(__dirname, '../../../uploads/books/', findPromise.bookDB.file);

    if (fs.existsSync(filePath)) {
        return res.status(200).sendFile(filePath);
    } else {
        return res.status(404).sendFile(path.join(__dirname, '../../../assets/no_file.png'));
    }
}

module.exports = getBookFile;