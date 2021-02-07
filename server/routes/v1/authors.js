/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Author routes.
*/

const express = require('express');
const app = express();

const authorsService = require('../../services/authors');
const { verifyToken, verifyAdminRole } = require('../../middlewares/auth');

// POST requests.
app.post('/api/v1/authors', [ verifyToken, verifyAdminRole ], (req, res) => authorsService.createAuthor(req, res));

// PUT requests.
app.put('/api/v1/authors/:id', [ verifyToken, verifyAdminRole ], (req, res) => authorsService.updateAuthor(req, res));

// GET requests.
app.get('/api/v1/authors/:id', verifyToken, (req, res) => authorsService.getAuthorById(req, res));
app.get('/api/v1/authors', verifyToken, (req, res) => authorsService.getAuthors(req, res));

// DELETE requests.
app.delete('/api/v1/authors/suspend/:id', [ verifyToken, verifyAdminRole ], (req, res) => authorsService.suspendAuthorById(req, res));
app.delete('/api/v1/authors/:id', [ verifyToken, verifyAdminRole ], (req, res) => authorsService.deleteAuthorById(req, res));

module.exports = app;