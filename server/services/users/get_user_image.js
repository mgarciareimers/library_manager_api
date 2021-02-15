/**
* Author: mgarciareimers
* Date: 15/02/2021
* 
* Description: Method that gets the profile image of a user.
*/

const fs = require('fs');
const path = require('path');

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');

const User = require('../../models/user');

const getUserImage = async (req, res) => {
    const { id } = req.params;
    
    // Check if user exists in database.
    const findPromise = await new Promise(resolve => User.findById(id, (error, userDB) => resolve({ error: error, userDB: userDB })));
     
    if (findPromise.error !== undefined && findPromise.error !== null) {
        const errorCode = findPromise.error.errors === undefined || findPromise.error.errors === null || findPromise.error.errors[Object.keys(findPromise.error.errors)[0]].properties === undefined || findPromise.error.errors[Object.keys(findPromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_GET_USER_BY_ID : findPromise.error.errors[Object.keys(findPromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_GET_USER_BY_ID ? 500 : 400).sendFile(path.join(__dirname, '../../../assets/no_image.jpg'));
    } else if (findPromise.userDB === undefined || findPromise.userDB === null) {
        return res.status(404).sendFile(path.join(__dirname, '../../../assets/no_image.jpg'));
    }

    // Get image.
    const imagePath = path.join(__dirname, '../../../uploads/users/', findPromise.userDB.image);

    if (fs.existsSync(imagePath)) {
        return res.status(200).sendFile(imagePath);
    } else {
        return res.status(404).sendFile(path.join(__dirname, '../../../assets/no_image.jpg'));
    }
}

module.exports = getUserImage;