/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Language service that returns a value from a key in a dictionary in the input language.
*/

// Dictionaries.
const en = require('./en.json');
const es = require('./es.json');

// Language codes.
const EN = 'en';
const ES = 'es';

// Method that returns a sentence of the dictionary.
const getValue = (language, key) => {
    try {
        switch(language) {
            case EN: return en[en[key] === undefined ? 'generic_error' : key];
            case ES: return es[es[key] === undefined ? 'generic_error' : key];
            default: return es[es[key] === undefined ? 'generic_error' : key];
        }
    } catch(e) {
        switch(language) {
            case EN: return en['generic_error'];
            case ES: return es['generic_error'];
            default: return es['generic_error'];
        }
    }
}

module.exports = {
    getValue,
    EN,
    ES,
}