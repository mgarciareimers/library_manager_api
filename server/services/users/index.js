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
const forgotPassword = require('./forgot_password');
const updateUser = require('./update_user');

// GET requests.
const getUserById = require('./get_user_by_id');
const getUsers = require('./get_users');
const verifyAccount = require('./verify_account');

// DELETE requests.
const deleteUserById = require('./delete_user_by_id');
const suspendAccountById = require('./suspend_account_by_id');

module.exports = {
    createUser,
    signUp,

    changePassword,
    forgotPassword,
    updateUser,

    getUserById,
    getUsers,
    verifyAccount,

    deleteUserById,
    suspendAccountById,
}