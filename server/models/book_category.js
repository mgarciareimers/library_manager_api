/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Book category model.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('../commons/constants');

// Define schema.
const bookCategorySchema = new Schema({
    book: {
        type: Schema.Types.ObjectId,
        ref: constants.models.BOOK,
        required: [true, constants.errorCodes.BOOK_CATEGORY_BOOK_REQUIRED],
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: constants.models.CATEGORY,
        required: [true, constants.errorCodes.BOOK_CATEGORY_CATEGORY_REQUIRED],
    },
    state: {
        type: String,
        enum: {
            values: [ constants.strings.STATE_OK, constants.strings.STATE_DELETED ],
            message: constants.errorCodes.BOOK_CATEGORY_STATE_NOT_VALID,
        },
        default: constants.strings.STATE_OK,
    }
});

module.exports = mongoose.model(constants.models.BOOK_CATEGORY, bookCategorySchema);