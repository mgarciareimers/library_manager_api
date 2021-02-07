/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Authors service main script.
*/

// POST requests.
const createAuthor = require('./create_author');

// PUT requests.
const updateAuthor = require('./update_author');

// GET requests.
const getAuthorById = require('./get_author_by_id');
const getAuthors = require('./get_authors');

// DELETE requests.
const deleteAuthorById = require('./delete_author_by_id');
const suspendAuthorById = require('./suspend_author_by_id');

module.exports = {
    createAuthor,

    updateAuthor,

    getAuthorById,
    getAuthors,

    deleteAuthorById,
    suspendAuthorById,
}