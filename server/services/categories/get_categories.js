/**
* Author: mgarciareimers
* Date: 09/02/2021
* 
* Description: Method that gets all categories (pagination included).
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Category = require('../../models/category');

const getCategories = async (req, res) => {
    const languageCode = req.headers.language;

    const pageNumber = req.query.pageNumber === undefined || req.query.pageNumber === null || isNaN(parseInt(req.query.pageNumber)) || parseInt(req.query.pageNumber) < constants.numbers.GET_DOCUMENT_FIRST_PAGE ? constants.numbers.GET_DOCUMENT_FIRST_PAGE : parseInt(req.query.pageNumber);
    const limit = req.query.limit === undefined || req.query.limit === null || isNaN(parseInt(req.query.limit)) || parseInt(req.query.limit) < 0 ? constants.numbers.DEFAULT_GET_CATEGORIES_LIMIT : parseInt(req.query.limit);
    const { state } = req.query;

    const filterObject = { 
        state: new RegExp(req.user.role !== constants.strings.ROLE_ADMIN ? constants.strings.STATE_OK : (state === undefined || state === null ? constants.strings.EMPTY_STRING : state), 'i'), 
    }; 

    // Get list of categories.
    Category.find(filterObject).sort(constants.models.IDENTIFIER).limit(limit).skip((pageNumber - 1) * limit).exec((error, categoriesDB) => {
        if (error) {
            utils.logError(constants.errorCodes.GENERIC_ERROR_GET_CATEGORIES);
            return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_CATEGORIES), categories: null });
        } 

        Category.countDocuments(filterObject, (error, total) => {
            if (error) {
                utils.logError(constants.errorCodes.GENERIC_ERROR_GET_CATEGORIES);
                return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_GET_CATEGORIES), categories: null });
            } 

            return res.status(200).json({ success: true, message: null, total: total, count: categoriesDB.length, categories: categoriesDB });
        });
    });
}

module.exports = getCategories;