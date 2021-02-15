/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Book routes.
*/

const express = require('express');
const app = express();

const booksService = require('../../services/books');
const { verifyToken, verifyTokenQuery, verifyAdminRole } = require('../../middlewares/auth');

// POST requests.
app.post('/api/v1/books', [ verifyToken, verifyAdminRole ], (req, res) => booksService.createBook(req, res));
app.post('/api/v1/books/uploadfile', [ verifyToken, verifyAdminRole ], (req, res) => booksService.uploadBookFile(req, res));

// PUT requests.
app.put('/api/v1/books/:id', [ verifyToken, verifyAdminRole ], (req, res) => booksService.updateBook(req, res));

// GET requests.
app.get('/api/v1/books/:id', verifyToken, (req, res) => booksService.getBookById(req, res));
app.get('/api/v1/books/file/:id', verifyTokenQuery, (req, res) => booksService.getBookFile(req, res));
app.get('/api/v1/books', verifyToken, (req, res) => booksService.getBooks(req, res));

// DELETE requests.
app.delete('/api/v1/books/suspend/:id', [ verifyToken, verifyAdminRole ], (req, res) => booksService.suspendBookById(req, res));
app.delete('/api/v1/books/:id', [ verifyToken, verifyAdminRole ], (req, res) => booksService.deleteBookById(req, res));

module.exports = app;