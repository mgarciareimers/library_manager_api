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
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            version: '1.0.0',
            title: 'Library Manager API',
            description: 'Basic API for library management.',
            contact: {
                name: 'Miguel García Reimers',
                email: 'mgarciareimers@gmail.com',
                url: 'https://www.linkedin.com/in/miguelgarciareimers'
            },
            servers: [
                'http://localhost:3000',
            ]
        },
    },
    basePath: '/',
    apis: ['../routes/index.js'],
};

const doc = swaggerDoc(options);

app.use('/', swaggerUI.serve, swaggerUI.setup(doc));

module.exports = app;