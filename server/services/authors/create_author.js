/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Method that creates an author.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Author = require('../../models/author');

const createAuthor = (req, res) => {
    const { body } = req;
    const languageCode = req.headers.language;
    
    const author = new Author({
        name: body.name, 
        surname: body.surname,
        completeName: `${ body.name } ${ body.surname }`,  
        birthdate: body.birthdate,  
        state: constants.strings.STATE_OK, 
    });

    author.save(async (error, authorDB) => {
        if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_CREATE_AUTHOR : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_CREATE_AUTHOR ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), author: null });
        } 

        return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_AUTHOR), author: authorDB });
    });
}

module.exports = createAuthor;