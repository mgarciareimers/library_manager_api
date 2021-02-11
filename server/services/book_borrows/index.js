/**
* Author: mgarciareimers
* Date: 11/02/2021
* 
* Description: Book borrows service main script.
*/

// POST requests.
const createBookBorrow = require('./create_book_borrow');

// PUT requests.
const updateBookBorrowPage = require('./update_book_borrow_page');

// GET requests.
const getBookBorrowById = require('./get_book_borrow_by_id');
const getBookBorrows = require('./get_book_borrows');

// DELETE requests.
const deleteBookBorrowById = require('./delete_book_borrow_by_id');

module.exports = {
    createBookBorrow,

    updateBookBorrowPage,

    getBookBorrowById,
    getBookBorrows,

    deleteBookBorrowById,
}