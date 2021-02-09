/**
* Author: mgarciareimers
* Date: 09/02/2021
* 
* Description: Category model.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const uniqueValidator = require('mongoose-unique-validator');

const constants = require('../commons/constants');

// Define schema.
const categorySchema = new Schema({
    identifier: {
        type: String,
        unique: true,
        required: [true, constants.errorCodes.CATEGORY_IDENTIFIER_REQUIRED],
    },
    values: {
        type: [ { language: String, value: String } ],
        required: [true, constants.errorCodes.CATEGORY_VALUES_REQUIRED],
    },
    state: {
        type: String,
        enum: {
            values: [ constants.strings.STATE_OK, constants.strings.STATE_DELETED ],
            message: constants.errorCodes.AUTHOR_STATE_NOT_VALID,
        },
        default: constants.strings.STATE_OK,
    }
});

// Add unique validation.
categorySchema.plugin(uniqueValidator, { message: constants.errorCodes.CATEGORY_ALREADY_EXISTS });

module.exports = mongoose.model(constants.models.CATEGORY, categorySchema);