/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Main script.
*/

require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');

const utils = require('./commons/utils');

const app = express();

app.use(cors());
app.use(express.json());
 
// Documentation config.
app.use('/documentation', require('./documentation/swagger_config'));

// File upload.
app.use(fileUpload({ useTempFiles : true, tempFileDir : '/tmp/', createParentPath: true }));

// Routes config.
app.use(require('./routes'));

// Database connection.
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true }, (error, res) => {
  if (error) {
    utils.logError(error);
    throw error;
  }
});

app.listen(process.env.PORT, () => console.log('Listening port:', process.env.PORT));