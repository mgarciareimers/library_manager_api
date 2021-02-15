/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Utils script.
*/

const fs = require('fs');
const strings = require('./constants/strings');

// Method that pads a string to the left and/or right of another string.
const padString = (string, stringToPad, length, padLeft, padRight) => {
    if (string.length > length || !padLeft && !padRight) {
        return string;
    }

    while(string.length < length) {
        if (padLeft) {
            string = stringToPad + string;
        }

        if (padRight) {
            string = string + stringToPad;
        }
    }

    return string;
}

// Method that adds a log to an error file.
const logError = (error) => {
    const date = new Date();
    fs.appendFileSync(`${ __dirname }/../logs/${ date.getFullYear() }${ padString((date.getMonth() + 1).toString(), strings.ZERO, 2, true, false) }${ padString(date.getDate().toString(), strings.ZERO, 2, true, false) }_ERROR.txt`, `${ padString(date.getHours().toString(), strings.ZERO, 2, true, false) }:${ padString(date.getMinutes().toString(), strings.ZERO, 2, true, false) }:${ padString(date.getSeconds().toString(), strings.ZERO, 2, true, false) } - ${ error } \n`);
}

// Method that generates a random string.
const generateRandomString = (length) => {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!&';
    let string = '';

    for (let i = 0; i < length; ++i) {
        string += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    return string;
}

// Method that gets the file extension by filename.
const getExtensionByFilename = (filename) => {
    return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
}

module.exports = {
    padString,
    logError,
    generateRandomString,
    getExtensionByFilename,
}