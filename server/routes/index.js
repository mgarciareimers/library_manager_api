/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: Routes main script.
*/

const path = require('path');
const express = require('express');
const app = express();

const constants = require('../commons/constants');

// Set views.
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../../views'));

// Set routes.
app.use(require('./v1'));

// Enable public folder (only for testing).
if (process.env.ENVIRONMENT === constants.strings.DEV) {
    app.use(express.static(path.resolve(__dirname, '../../public')));
}

app.get('*', (req, res) => res.status(404).render('bad_request'));
app.post('*', (req, res) => res.status(404).render('bad_request'));
app.patch('*', (req, res) => res.status(404).render('bad_request'));
app.put('*', (req, res) => res.status(404).render('bad_request'));
app.delete('*', (req, res) => res.status(404).render('bad_request'));

module.exports = app;