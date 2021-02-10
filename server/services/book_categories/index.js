/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Book categories service main script.
*/

// POST requests.
const createBookCategory = require('./create_book_category');

// PUT requests.

// GET requests.
const getBookCategoryById = require('./get_book_category_by_id');
const getBookCategories = require('./get_book_categories');

// DELETE requests.
const deleteBookCategoryById = require('./delete_book_category_by_id');

module.exports = {
    createBookCategory,

    getBookCategoryById,
    getBookCategories,

    deleteBookCategoryById,
}