/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: Authentication routes.
*/

const express = require('express');
const app = express();

const authService = require('../../services/auth');

// POST requests.
app.post('/api/v1/googlesignin', (req, res) => authService.googleSignIn(req, res));
app.post('/api/v1/login', (req, res) => authService.login(req, res));

module.exports = app;