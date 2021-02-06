/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Server config.
*/

const constants = require('../commons/constants');

process.env.PORT = process.env.PORT || 3000; // Port.
process.env.ENVIRONMENT = process.env.ENVIRONMENT || constants.strings.DEV; // Port.
process.env.DATABASE_URL = process.env.ENVIRONMENT === constants.strings.DEV ? 'mongodb://localhost:27017/library_manager' : process.env.DATABASE_URL; // Database url.
process.env.JWT_SIGN_SEED = process.env.JWT_SIGN_SEED || 'library_manager_jwt_sign_seed'; // Jwt seed key.
process.env.GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '132769593997-niaegjo7bbp30jnegptfboluujvcaeur.apps.googleusercontent.com'; // Jwt seed key.
process.env.BACKEND_URL = process.env.ENVIRONMENT === constants.strings.DEV ? 'localhost:3000' : process.env.BACKEND_URL; // Database url.