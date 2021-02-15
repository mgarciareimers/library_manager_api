/**
* Author: mgarciareimers
* Date: 12/02/2021
* 
* Description: Swagger configuration for API documentation.
*/

const express = require('express');
const swaggerDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

const app = express();

const options = {
    swaggerDefinition: require('./openapi.json'),
    basePath: '/',
    apis: ['../routes/index.js'],
};

const doc = swaggerDoc(options);

app.use('/', swaggerUI.serve, swaggerUI.setup(doc));

module.exports = app;