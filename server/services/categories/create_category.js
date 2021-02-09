/**
* Author: mgarciareimers
* Date: 09/02/2021
* 
* Description: Method that creates a category.
*/

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Category = require('../../models/category');

const createCategory = async (req, res) => {
    const { body } = req;
    const languageCode = req.headers.language;

    // Prepare category.
    const category = new Category({
        identifier: body.values[0].value.replace(constants.strings.ONE_SPACE, constants.strings.HYPHEN).toLowerCase(),
        values: body.values,  
        state: constants.strings.STATE_OK, 
    });

    category.save(async (error, categoryDB) => {
        if (error) {
            const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_CREATE_CATEGORY : error.errors[Object.keys(error.errors)[0]].properties.message;
            utils.logError(errorCode);
            return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_CREATE_CATEGORY ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), category: null });
        } 

        return res.status(201).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_CREATE_CATEGORY), category: categoryDB });
    });
}

module.exports = createCategory;