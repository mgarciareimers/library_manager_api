/**
* Author: mgarciareimers
* Date: 09/02/2021
* 
* Description: Method that updates a category.
*/

const _ = require('underscore');
const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const Category = require('../../models/category');

const updateUser = async (req, res) => {
    const { values } = req.body;
    const { id } = req.params;
    const languageCode = req.headers.language;

    // Check if category exists in database.
    const findPromise = await new Promise(resolve => Category.findById(id, (error, categoryDB) => resolve({ error: error, categoryDB: categoryDB })));

    if (findPromise.error !== undefined && findPromise.error !== null) {
        utils.logError(findPromise.error);
        return res.status(500).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.GENERIC_ERROR_FIND_CATEGORY), category: null });
    } else if (findPromise.categoryDB === null) {
        return res.status(404).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.CATEGORY_NOT_FOUND), category: null });
    }

    // Prepare category.
    const category = {
        identifier: values[0].value.replace(constants.strings.ONE_SPACE, constants.strings.HYPHEN).toLowerCase(),
        values: values,   
    };

    // Update category.
    const updatePromise = await new Promise(resolve => Category.findByIdAndUpdate(id, category, { new: true, runValidators: true, context: 'query' }, (error, categoryDB) => resolve({ error: error, categoryDB: categoryDB })))

    if (updatePromise.error !== undefined && updatePromise.error !== null) {
        const errorCode = updatePromise.error.errors === undefined || updatePromise.error.errors === null || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === undefined || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPDATE_CATEGORY : updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPDATE_CATEGORY ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), category: null });
    } 
   
   return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPDATE_CATEGORY), category: updatePromise.categoryDB });
}

module.exports = updateUser;