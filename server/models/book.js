/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Book model.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('../commons/constants');
const language = require('../language');

// Define schema.
const bookSchema = new Schema({
    title: {
        type: String,
        required: [true, constants.errorCodes.BOOK_NAME_REQUIRED],
    },
    subtitle: {
        type: String,
        default: null,
    },
    originalTitle: {
        type: String,
        required: [true, constants.errorCodes.BOOK_ORIGINAL_NAME_REQUIRED],
    },
    originalSubtitle: {
        type: String,
        default: null,
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: constants.models.AUTHOR,
        required: [true, constants.errorCodes.BOOK_AUTHOR_REQUIRED],
    },
    publicationYear: {
        type: Number,
        required: [true, constants.errorCodes.BOOK_PUBLICATION_YEAR_REQUIRED],
        validate: { 
            validator: Number.isInteger, 
            message: constants.errorCodes.BOOK_PUBLICATION_YEAR_NOT_INTEGER,
        }
    },
    editionNumber: {
        type: Number,
        required: [true, constants.errorCodes.BOOK_EDITION_NUMBER_REQUIRED],
        validate: { 
            validator: Number.isInteger, 
            message: constants.errorCodes.BOOK_EDITION_NUMBER_NOT_INTEGER,
        }
    },
    file: {
        type: String,
        default: null,
    },
    language: {
        type: String,
        default: language.ES,
    },
    state: {
        type: String,
        enum: {
            values: [ constants.strings.STATE_OK, constants.strings.STATE_DELETED ],
            message: constants.errorCodes.BOOK_STATE_NOT_VALID,
        },
        default: constants.strings.STATE_OK,
    }
});

module.exports = mongoose.model(constants.models.BOOK, bookSchema);