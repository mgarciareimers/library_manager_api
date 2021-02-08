/**
* Author: mgarciareimers
* Date: 07/02/2021
* 
* Description: Author model.
*/

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const constants = require('../commons/constants');

// Define schema.
const authorSchema = new Schema({
    name: {
        type: String,
        required: [true, constants.errorCodes.AUTHOR_NAME_REQUIRED],
    },
    surname: {
        type: String,
        required: [true, constants.errorCodes.AUTHOR_SURNAME_REQUIRED],
    },
    birthdate: {
        type: String,
        required: [true, constants.errorCodes.AUTHOR_BIRTHDATE_REQUIRED],
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

module.exports = mongoose.model(constants.models.AUTHOR, authorSchema);