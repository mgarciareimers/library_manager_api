/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: User routes.
*/
const express = require('express');
const app = express();

const usersService = require('../../services/users')

// POST requests.
app.post('/v1/users', (req, res) => usersService.createUser(req, res));
app.post('/v1/signup', (req, res) => usersService.signUp(req, res));

// PUT requests.
app.put('/v1/users/:id', (req, res) => usersService.updateUser(req, res));

// GET requests.
app.get('/v1/users/:id', (req, res) => usersService.getUserById(req, res));
app.get('/v1/users', (req, res) => usersService.getUsers(req, res));


module.exports = app;