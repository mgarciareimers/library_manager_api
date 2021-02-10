/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Book category routes.
*/

const express = require('express');
const app = express();

const bookCategoriesService = require('../../services/book_categories');
const { verifyToken, verifyAdminRole } = require('../../middlewares/auth');

// POST requests.
app.post('/api/v1/bookcategories', [ verifyToken, verifyAdminRole ], (req, res) => bookCategoriesService.createBookCategory(req, res));

// PUT requests.

// GET requests.
app.get('/api/v1/bookcategories/:id', verifyToken, (req, res) => bookCategoriesService.getBookCategoryById(req, res));
app.get('/api/v1/bookcategories', verifyToken, (req, res) => bookCategoriesService.getBookCategories(req, res));

// DELETE requests.
app.delete('/api/v1/bookcategories/:id', [ verifyToken, verifyAdminRole ], (req, res) => bookCategoriesService.deleteBookCategoryById(req, res));

module.exports = app;