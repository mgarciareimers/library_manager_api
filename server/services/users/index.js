/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Users service main script.
*/

// POST requests.
const createUser = require('./create_user');
const signUp = require('./sign_up');
const uploadUserImage = require('./upload_user_image');

// PUT requests.
const changePassword = require('./change_password');
const forgotPassword = require('./forgot_password');
const updateUser = require('./update_user');

// GET requests.
const getUserById = require('./get_user_by_id');
const getUserImage = require('./get_user_image');
const getUsers = require('./get_users');
const verifyAccount = require('./verify_account');

// DELETE requests.
const deleteUserById = require('./delete_user_by_id');
const suspendAccountById = require('./suspend_account_by_id');

module.exports = {
    createUser,
    signUp,
    uploadUserImage,

    changePassword,
    forgotPassword,
    updateUser,

    getUserById,
    getUserImage,
    getUsers,
    verifyAccount,

    deleteUserById,
    suspendAccountById,
}