/**
* Author: mgarciareimers
* Date: 04/02/2021
* 
* Description: Auth service main script.
*/

// POST requests.
const googleSignIn = require('./google_sign_in');
const login = require('./login');

module.exports = {
    googleSignIn,
    login,
}