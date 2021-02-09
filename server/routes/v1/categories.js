/**
* Author: mgarciareimers
* Date: 09/02/2021
* 
* Description: Category routes.
*/

const express = require('express');
const app = express();

const categoriesService = require('../../services/categories');
const { verifyToken, verifyAdminRole } = require('../../middlewares/auth');

// POST requests.
app.post('/api/v1/categories', [ verifyToken, verifyAdminRole ], (req, res) => categoriesService.createCategory(req, res));

// PUT requests.
app.put('/api/v1/categories/:id', [ verifyToken, verifyAdminRole ], (req, res) => categoriesService.updateCategory(req, res));

// GET requests.
app.get('/api/v1/categories/:id', verifyToken, (req, res) => categoriesService.getCategoryById(req, res));
app.get('/api/v1/categories', verifyToken, (req, res) => categoriesService.getCategories(req, res));

// DELETE requests.
app.delete('/api/v1/categories/suspend/:id', [ verifyToken, verifyAdminRole ], (req, res) => categoriesService.suspendCategoryById(req, res));
app.delete('/api/v1/categories/:id', [ verifyToken, verifyAdminRole ], (req, res) => categoriesService.deleteCategoryById(req, res));

module.exports = app;