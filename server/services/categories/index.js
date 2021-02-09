/**
* Author: mgarciareimers
* Date: 09/02/2021
* 
* Description: Categories service main script.
*/

// POST requests.
const createCategory = require('./create_category');

// PUT requests.
const updateCategory = require('./update_category');

// GET requests.
const getCategoryById = require('./get_category_by_id');
const getCategories = require('./get_categories');

// DELETE requests.
const deleteCategoryById = require('./delete_category_by_id');
const suspendCategoryById = require('./suspend_category_by_id');

module.exports = {
    createCategory,

    updateCategory,

    getCategoryById,
    getCategories,

    deleteCategoryById,
    suspendCategoryById,
}