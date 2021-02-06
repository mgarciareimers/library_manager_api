/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Send email script.
*/

const nodemailer = require('nodemailer');
const language = require('../language');

const INFO_MAIL = 'info@librarymanager.com';
const NO_REPLY_MAIL = 'noreply@librarymanager.com';

// Method that sends an email.
const sendEmail = (from, to, subject, html, text) => {
    let transport = nodemailer.createTransport({
        host : 'smtp.mailtrap.io',
        port : '2525',
        // secure: true,
        auth : {
            user: "4d3bea9b0f48e8",
            pass: "388e01ebe11531"
        },
    });

    const message = {
        from : from,
        to : to,
        subject : subject,
        html : html,
        text : text,
    }

    return new Promise(resolve => transport.sendMail(message, (error, info) => resolve(error === null)));
}

// Method that gets a welcome email (credentials) content.
const getWelcomeCredentialsEmailContent = (languageCode, name, verificationToken) => {
    const html = `
        <a target='blank' href='${ process.env.BACKEND_URL }/api/v1/verifyaccount/${ verificationToken }/${ languageCode }'>Link</a>
    `;

    const plainText = `
        Link
    `;

    return { html: html, plainText: plainText };
}

// Method that gets a welcome email (admin created) content.
const getWelcomeAdminCreatedEmailContent = (languageCode, name, password, verificationToken) => {
    const html = `
        <a target='blank' href='${ process.env.BACKEND_URL }/api/v1/verifyaccount/${ verificationToken }/${ languageCode }'>Link</a>
        <br>
        <p>Pass: ${ password } </p>
    `;

    const plainText = `
        Link, password
    `;

    return { html: html, plainText: plainText };
}

// Method that gets a welcome email (google) content.
const getWelcomeGoogleEmailContent = (languageCode, name, verificationToken) => {
    const html = `
        <a target='blank' href='${ process.env.BACKEND_URL }/api/v1/verifyaccount/${ verificationToken }/${ languageCode }'>Link</a>
    `;

    const plainText = `
        Link
    `;

    return { html: html, plainText: plainText };
}

// Method that gets a forgot password email content.
const getForgotPasswordEmailContent = (languageCode, name, password) => {
    const html = `
        Name: ${ name }
        Pass: ${ password }
    `;

    const plainText = `
        name, password
    `;

    return { html: html, plainText: plainText };
}

module.exports = {
    getForgotPasswordEmailContent,
    getWelcomeAdminCreatedEmailContent,
    getWelcomeCredentialsEmailContent,
    getWelcomeGoogleEmailContent,
    sendEmail,

    NO_REPLY_MAIL,
}