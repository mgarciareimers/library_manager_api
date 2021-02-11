/**
* Author: mgarciareimers
* Date: 10/02/2021
* 
* Description: Book borrow model.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('../commons/constants');
const language = require('../language');

// Define schema.
const bookBorrowSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: constants.models.USER,
        required: [true, constants.errorCodes.BOOK_BORROW_USER_REQUIRED],
    },
    book: {
        type: Schema.Types.ObjectId,
        ref: constants.models.BOOK,
        required: [true, constants.errorCodes.BOOK_BORROW_BOOK_REQUIRED],
    },
    currentPage: {
        type: Number,
        default: constants.numbers.ZERO,
        validate: { 
            validator: Number.isInteger, 
            message: constants.errorCodes.BOOK_BORROW_CURRENT_PAGE_NOT_INTEGER,
        }
    },
    startDate: {
        type: Date,
        default: new Date(),
    },
    endDate: {
        type: Date,
        default: null,
    },
    modificationDate: {
        type: Date,
        default: new Date(),
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

module.exports = mongoose.model(constants.models.BOOK_BORROW, bookBorrowSchema);