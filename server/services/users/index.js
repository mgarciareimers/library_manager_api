/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Users service main script.
*/

// POST requests.
const createUser = require('./create_user');
const signUp = require('./sign_up');

// PUT requests.
const updateUser = require('./update_user');

module.exports = {
    createUser,
    signUp,
    updateUser,
}