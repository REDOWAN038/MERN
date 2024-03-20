const { body } = require("express-validator")
const categoryModel = require("../models/categoryModel")

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

// validate user forget password input
const validateUserForgetPassword = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Emails is not valid"),
]

// validate user reset password input
const validateUserResetPassword = [
    body("token")
        .trim()
        .notEmpty()
        .withMessage("Token is required"),

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

// validate category
const validateCategory = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("category name is required"),
]

// validate product
const validateProduct = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("product name is required"),
    body("description")
        .trim()
        .notEmpty()
        .withMessage("product description is required")
        .isLength({ min: 10 }) // Ensure description has a minimum length of 10 characters
        .withMessage("Description must be at least 10 characters long"),
    body("price")
        .notEmpty()
        .withMessage("Product price is required")
        .isNumeric()
        .withMessage("Price must be a numeric value")
        .isFloat({ min: 0 })
        .withMessage("Price must be a non-negative value"),
    body("quantity")
        .notEmpty()
        .withMessage("Product quantity is required")
        .isNumeric()
        .withMessage("Quantity must be a numeric value")
        .isFloat({ min: 0 })
        .withMessage("Quantity must be a non-negative value"),
    body("sold")
        .isNumeric()
        .withMessage("Sold must be a numeric value")
        .isFloat({ min: 0 })
        .withMessage("Sold must be a non-negative value"),
    body("shipping")
        .isNumeric()
        .withMessage("Shipping must be a numeric value")
        .isFloat({ min: 0 })
        .withMessage("Shipping must be a non-negative value"),
    body("image")
        .trim()
        .notEmpty()
        .withMessage("product image is required"),
    body("category")
        .trim()
        .notEmpty()
        .withMessage("Category is required")
        .custom(async (value, { req }) => {
            // Check if the category exists in the database
            const category = await categoryModel.findOne({ name: value });
            if (!category) {
                throw new Error("Invalid category");
            }
            return true;
        })
]

module.exports = {
    validateUserRegistration,
    validateUserLogin,
    validateUpdatePasswordLogin,
    validateUserForgetPassword,
    validateUserResetPassword,
    validateCategory,
    validateProduct
}