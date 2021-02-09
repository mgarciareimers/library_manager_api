/**
* Author: mgarciareimers
* Date: 08/02/2021
* 
* Description: Method that gets a category by its id.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Category = require('../../models/category');

const getCategoryById = async (req, res) => {
    const { id } = req.params;
    const languageCode = req.headers.language;
    
    // Check if category exists in database.
    Category.findById(id, (error, categoryDB) => {
        if (error !== undefined && error !== null) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_GET_CATEGORY_BY_ID : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_GET_CATEGORY_BY_ID ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), category: null });
        } else if (categoryDB === undefined || categoryDB === null) {
            return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.CATEGORY_NOT_FOUND), category: null });
        }

        return res.status(200).json({ success: true, message: null, category: categoryDB });
    });
}

module.exports = getCategoryById;