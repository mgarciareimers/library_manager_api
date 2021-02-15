/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Books service main script.
*/

// POST requests.
const createBook = require('./create_book');
const uploadBookFile = require('./upload_book_file');

// PUT requests.
const updateBook = require('./update_book');

// GET requests.
const getBookById = require('./get_book_by_id');
const getBookFile = require('./get_book_file');
const getBooks = require('./get_books');

// DELETE requests.
const deleteBookById = require('./delete_book_by_id');
const suspendBookById = require('./suspend_book_by_id');

module.exports = {
    createBook,
    uploadBookFile,

    updateBook,

    getBookById,
    getBookFile,
    getBooks,

    deleteBookById,
    suspendBookById,
}