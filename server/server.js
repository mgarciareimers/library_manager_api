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
 
// Define routes.
app.use(require('./routes/v1/users'));

// Database connection.
mongoose.connect('mongodb://localhost:27017/library_manager', { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (error, res) => {
  if (error) {
    utils.logError(error);
    throw error;
  }
});
 
app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));