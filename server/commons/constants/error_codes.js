/**
* Author: mgarciareimers
* Date: 30/01/2021
* 
* Description: Error codes.
*/
module.exports = {
    ACCOUNT_ALREADY_VERIFIED: 'account_already_verified',
    ACCOUNT_DELETED_NOT_AUTHORIZED: 'account_deleted_not_authorized',
    ACCOUNT_GOOGLE_LOGIN_NOT_AUTHORIZED: 'account_google_login_not_authorized',
    ACCOUNT_NOT_VERIFIED: 'account_not_verified',
    ACCOUNT_VERIFICATION_TEXT_GENERAL_ERROR: 'account_verification_text_general_error',
    ACCOUNT_VERIFICATION_TITLE_GENERAL_ERROR: 'account_verification_title_general_error',
    AUTHOR_BIRTHDATE_REQUIRED: 'author_birthdate_required',
    AUTHOR_NAME_REQUIRED: 'author_name_required',
    AUTHOR_NOT_FOUND: 'author_not_found',
    AUTHOR_STATE_NOT_VALID: 'author_state_not_valid',
    AUTHOR_SURNAME_REQUIRED: 'author_surname_required',
    
    BOOK_ALREADY_EXISTS: 'book_already_exists',
    BOOK_AUTHOR_REQUIRED: 'book_author_required',
    BOOK_EDITION_NUMBER_NOT_INTEGER: 'book_edition_number_not_integer',
    BOOK_EDITION_NUMBER_REQUIRED: 'book_edition_number_required',
    BOOK_NOT_FOUND: 'book_not_found',
    BOOK_ORIGINAL_SUBTITLE_REQUIRED: 'book_original_subtitle_required',
    BOOK_ORIGINAL_TITLE_REQUIRED: 'book_original_title_required',
    BOOK_PUBLICATION_YEAR_NOT_INTEGER: 'book_publication_year_not_integer',
    BOOK_PUBLICATION_YEAR_REQUIRED: 'book_publication_year_required',
    BOOK_STATE_NOT_VALID: 'book_state_not_valid',
    BOOK_SUBTITLE_REQUIRED: 'book_subtitle_required',
    BOOK_TITLE_REQUIRED: 'book_title_required',

    GENERIC_ERROR: 'generic_error',
    GENERIC_ERROR_CREATE_ACCOUNT: 'generic_error_create_account',
    GENERIC_ERROR_CREATE_AUTHOR: 'generic_error_create_author',
    GENERIC_ERROR_CREATE_BOOK: 'generic_error_create_book',
    GENERIC_ERROR_DELETE_AUTHOR_BY_ID: 'generic_error_delete_author_by_id',
    GENERIC_ERROR_DELETE_USER_BY_ID: 'generic_error_delete_user_by_id',
    GENERIC_ERROR_FIND_AUTHOR: 'generic_error_find_author',
    GENERIC_ERROR_FIND_BOOK: 'generic_error_find_book',
    GENERIC_ERROR_FIND_USER: 'generic_error_find_user',
    GENERIC_ERROR_GET_AUTHOR_BY_ID: 'generic_error_get_author_by_id',
    GENERIC_ERROR_GET_AUTHORS: 'generic_error_get_authors',
    GENERIC_ERROR_GET_BOOK_BY_ID: 'generic_error_get_book_by_id',
    GENERIC_ERROR_GET_BOOKS: 'generic_error_get_books',
    GENERIC_ERROR_GET_USER_BY_ID: 'generic_error_get_user_by_id',
    GENERIC_ERROR_GET_USERS: 'generic_error_get_users',
    GENERIC_ERROR_RESET_PASSWORD: 'generic_error_reset_password',
    GENERIC_ERROR_UPDATE_AUTHOR: 'generic_error_update_author',
    GENERIC_ERROR_UPDATE_BOOK: 'generic_error_update_book',
    GENERIC_ERROR_UPDATE_PASSWORD: 'generic_error_update_password',
    GENERIC_ERROR_UPDATE_USER: 'generic_error_update_user',
    GOOGLE_USER_NORMAL_EXISTS: 'google_user_normal_exists',
    GOOGLE_USER_NOT_VALID: 'google_user_not_valid',

    INVALID_CREDENTIALS: 'invalid_credentials',

    NEW_PASSWORD_NOT_VALID: 'new_password_not_valid',
    
    OLD_PASSWORD_NOT_VALID: 'old_password_not_valid',

    USER_EMAIL_EXISTS: 'user_email_exists',
    USER_EMAIL_REQUIRED: 'user_email_required',
    USER_GOOGLE_FORMAT_NOT_VALID: 'user_google_format_not_valid',
    USER_NAME_REQUIRED: 'user_name_required',
    USER_NOT_AUTHORIZED: 'user_not_authorized',
    USER_NOT_AUTHORIZED_CREDENTIALS: 'user_not_authorized_credentials',
    USER_NOT_FOUND: 'user_not_found',
    USER_PASSWORD_REQUIRED: 'user_password_required',
    USER_ROLE_NOT_VALID: 'user_role_not_valid',
    USER_STATE_NOT_VALID: 'user_state_not_valid',
    USER_SURNAME_REQUIRED: 'user_surname_required',
}