/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: User routes.
*/

const express = require('express');
const app = express();

const usersService = require('../../services/users');

const { verifyToken, verifyTokenQuery, verifyAdminRole } = require('../../middlewares/auth');
const { applyCreateUserValidationRules, applySignUpValidationRules, validate } = require('../../middlewares/validator');

// POST requests.
app.post('/api/v1/users', [ verifyToken, verifyAdminRole, applyCreateUserValidationRules(), validate ], usersService.createUser);
app.post('/api/v1/signup', [ applySignUpValidationRules(), validate ], usersService.signUp);
app.post('/api/v1/users/uploadimage', verifyToken, usersService.uploadUserImage);

// PUT requests.
app.put('/api/v1/users/changepassword', verifyToken, usersService.changePassword);
app.put('/api/v1/users/forgotpassword', usersService.forgotPassword);
app.put('/api/v1/users/:id', verifyToken, usersService.updateUser);

// GET requests.
app.get('/api/v1/users/:id', verifyToken, usersService.getUserById);
app.get('/api/v1/users/image/:id', verifyTokenQuery, usersService.getUserImage);
app.get('/api/v1/users', verifyToken, usersService.getUsers);
app.get('/api/v1/verifyaccount/:verificationToken/:language', usersService.verifyAccount);

// DELETE requests.
app.delete('/api/v1/users/suspend/:id', verifyToken, usersService.suspendAccountById);
app.delete('/api/v1/users/:id', [ verifyToken, verifyAdminRole ], usersService.deleteUserById);

module.exports = app;