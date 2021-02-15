/**
* Author: mgarciareimers
* Date: 14/02/2021
* 
* Description: Method that uploads a user image.
*/

const path = require('path');
const fs = require('fs');
const { v5: uuidV5 } = require('uuid');

const utils = require('../../commons/utils');
const constants = require('../../commons/constants');
const language = require('../../language');

const User = require('../../models/user');

const uploadUserImage = async (req, res) => {
    const languageCode = req.headers.language;
    
    if (req.files === undefined || req.files === null || Object.keys(req.files).length === 0 || req.files.image === undefined || req.files.image === null) {
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_IMAGE_NOT_VALID), user: null });
    }

    const { image } = req.files;

    // Validate file extension.
    const extension = utils.getExtensionByFilename(image.name);
    
    if (extension !== constants.strings.EXTENSION_PNG && extension !== constants.strings.EXTENSION_JPG) {
        return res.status(400).json({ success: false, message: language.getValue(languageCode, constants.errorCodes.USER_IMAGE_NOT_VALID), user: null });
    }
    
    const imageName = `${ uuidV5(Date.now().toString() + utils.generateRandomString(constants.numbers.UPLOAD_FILE_RANDOM_STRING_LENGTH), process.env.APP_UUID) }.${ extension }`;
    const uploadPath = path.join(__dirname, '../../../uploads/users/', imageName);
    
    // Save file.
    const saveFilePromise = await new Promise(resolve => image.mv(uploadPath, (error) => resolve({ error: error })));
    
    if (saveFilePromise.error !== undefined && saveFilePromise.error !== null) {
        const errorCode = error.errors === undefined || error.errors === null || error.errors[Object.keys(error.errors)[0]].properties === undefined || error.errors[Object.keys(error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPLOAD_USER_IMAGE : error.errors[Object.keys(error.errors)[0]].properties.message;
        utils.logError(errorCode);
        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPLOAD_USER_IMAGE ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), user: null });
    }

    // Update image path in user.
    const updatePromise = await new Promise(resolve => User.findByIdAndUpdate(req.user.id, { image: imageName }, { new: true, runValidators: true }, (error, userDB) => resolve({ error: error, userDB: userDB })))

    if (updatePromise.error !== undefined && updatePromise.error !== null) {
        const errorCode = updatePromise.error.errors === undefined || updatePromise.error.errors === null || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === undefined || updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties === null ? constants.errorCodes.GENERIC_ERROR_UPLOAD_USER_IMAGE : updatePromise.error.errors[Object.keys(updatePromise.error.errors)[0]].properties.message;
        utils.logError(errorCode);

        // In case of error, remove file.
        try { fs.unlinkSync(uploadPath); } 
        catch(e) {}

        return res.status(errorCode === constants.errorCodes.GENERIC_ERROR_UPLOAD_USER_IMAGE ? 500 : 400).json({ success: false, message: language.getValue(languageCode, errorCode), user: null });
    } 

    // In case of error, remove file.
    try { fs.unlinkSync(path.join(__dirname, '../../../uploads/users/', req.user.image)); } 
    catch(e) {}
    
    return res.status(200).json({ success: true, message: language.getValue(languageCode, constants.stringCodes.SUCCESS_UPLOAD_USER_IMAGE), user: updatePromise.userDB });
}

module.exports = uploadUserImage;