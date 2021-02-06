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
const changePassword = require('./change_password');
const updateUser = require('./update_user');

// GET requests.
const getUserById = require('./get_user_by_id');
const getUsers = require('./get_users');

// DELETE requests.
const deleteUserById = require('./delete_user_by_id');
const suspendAccountById = require('./suspend_account_by_id');

module.exports = {
    createUser,
    signUp,

    changePassword,
    updateUser,

    getUserById,
    getUsers,

    deleteUserById,
    suspendAccountById,
}