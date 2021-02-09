/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Method that updates an author.
*/

const _ = require('underscore');
const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Author = require('../../models/author');

const updateAuthor = async (req, res) => {
    const body = _.pick(req.body, [ 'name', 'surname', 'birthdate' ]);
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    // Check if author exists in database.
    const findPromise = await new Promise(resolve => Author.findById(id, (error, authorDB) => resolve({ error: error, authorDB: authorDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_AUTHOR), author: null });
    } else if (findPromise.authorDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.AUTHOR_NOT_FOUND), author: null });
    }

    // Update author.
    body.completeName = `${ body.name === undefined || body.name === null ? findPromise.authorDB.name : body.name } ${ body.surname === undefined || body.surname === null ? findPromise.authorDB.surname : body.surname }`;
    const updatePromise = await new Promise(resolve => Author.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (error, authorDB) => resolve({ error: error, authorDB: authorDB })))

    if (updatePromise.error !== undefined && updatePromise.error !== null) {
        const errorCode = updatePromise.error.errors === undefined || updatePromise.error.errors === null || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === undefined || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPDATE_AUTHOR : updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPDATE_AUTHOR ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), author: null });
    } 
   
   return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPDATE_AUTHOR), author: updatePromise.authorDB });
}

module.exports = updateAuthor;