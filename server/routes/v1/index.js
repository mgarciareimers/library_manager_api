/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: v1 routes main script.
*/

const express = require('express');
const app = express();

app.use(require('./auth'));
app.use(require('./authors'));
app.use(require('./books'));
app.use(require('./book_categories'));
app.use(require('./categories'));
app.use(require('./users'));

module.exports = app;