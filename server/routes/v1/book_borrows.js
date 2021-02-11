/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Book borrow routes.
*/

const express = require('express');
const app = express();

const bookBorrowsService = require('../../services/book_borrows');
const { verifyToken, verifyAdminRole } = require('../../middlewares/auth');

// POST requests.
app.post('/api/v1/bookborrows', verifyToken, (req, res) => bookBorrowsService.createBookBorrow(req, res));

// PUT requests.
app.put('/api/v1/bookborrows/:id', verifyToken, (req, res) => bookBorrowsService.updateBookBorrowPage(req, res));

// GET requests.
app.get('/api/v1/bookborrows/:id', verifyToken, (req, res) => bookBorrowsService.getBookBorrowById(req, res));
app.get('/api/v1/bookborrows', verifyToken, (req, res) => bookBorrowsService.getBookBorrows(req, res));

// DELETE requests.
app.delete('/api/v1/bookborrows/suspend/:id', [ verifyToken, verifyAdminRole ], (req, res) => bookBorrowsService.suspendBookBorrowById(req, res));
app.delete('/api/v1/bookborrows/:id', [ verifyToken, verifyAdminRole ], (req, res) => bookBorrowsService.deleteBookBorrowById(req, res));

module.exports = app;