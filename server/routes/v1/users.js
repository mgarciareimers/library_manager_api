/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: User routes.
*/

const express = require('express');
const app = express();

const usersService = require('../../services/users');
const { verifyToken, verifyAdminRole } = require('../../middlewares/auth');

// POST requests.
app.post('/api/v1/users', [ verifyToken, verifyAdminRole ], (req, res) => usersService.createUser(req, res));
app.post('/api/v1/signup', (req, res) => usersService.signUp(req, res));

// PUT requests.
app.put('/api/v1/users/changepassword', verifyToken, (req, res) => usersService.changePassword(req, res));
app.put('/api/v1/users/:id', verifyToken, (req, res) => usersService.updateUser(req, res));

// GET requests.
app.get('/api/v1/users/:id', verifyToken, (req, res) => usersService.getUserById(req, res));
app.get('/api/v1/users', verifyToken, (req, res) => usersService.getUsers(req, res));
app.get('/api/v1/verifyaccount/:verificationToken/:language', (req, res) => usersService.verifyAccount(req, res));

// DELETE requests.
app.delete('/api/v1/users/:id', [ verifyToken, verifyAdminRole ], (req, res) => usersService.deleteUserById(req, res));
app.delete('/api/v1/users/suspendaccount/:id', verifyToken, (req, res) => usersService.suspendAccountById(req, res));

module.exports = app;