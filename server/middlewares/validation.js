const { body } = require("express-validator")

// validate user registration input
const validateUserRegistration = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Name is required"),

    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Emails is not valid"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Pasword is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage("Password must be at least 8 characters, contain a lowercase letter, an uppercase letter, a number, and a special character"),

    body("address")
        .trim()
        .notEmpty()
        .withMessage("Address is required"),

    body("phone")
        .trim()
        .notEmpty()
        .withMessage("Phone is required")
        .matches(/^01\d{9}$/)
        .withMessage("Invalid phone number format. Must be 11 digits starting with 01."),

    body("image")
        .optional()
        .isString()
        .withMessage("user image is optional")
]

// validate user login input
const validateUserLogin = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Emails is not valid"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("Pasword is required")
]

// validate update password input
const validateUpdatePasswordLogin = [
    body("newPassword")
        .trim()
        .notEmpty()
        .withMessage("new password is required")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
        .withMessage("Password must be at least 8 characters, contain a lowercase letter, an uppercase letter, a number, and a special character"),

    body("confirmNewPassword")
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error("passwords did not match")
            }
            return true
        })
]

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUpdatePasswordLogin
}