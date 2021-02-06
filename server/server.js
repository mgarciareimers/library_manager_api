/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Main script.
*/

require('./config/config');
const express = require('express');
const mongoose = require('mongoose');

const utils = require('./commons/utils');

const app = express();

app.use(express.json());
 
// Routes config.
app.use(require('./routes'));

// Database connection.
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (error, res) => {
  if (error) {
    utils.logError(error);
    throw error;
  }
});

// Enable public folder (only for testing).
// app.use(express.static(path.resolve(__dirname, '../public')));
 
app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));