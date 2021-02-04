/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: Routes main script.
*/

const express = require('express');
const app = express();

app.use(require('./v1'));

module.exports = app;