/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: v1 routes main script.
*/

const express = require('express');
const app = express();

app.use(require('./auth'));
app.use(require('./users'));

module.exports = app;