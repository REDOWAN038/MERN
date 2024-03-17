const createError = require("http-errors")
const fs = require("fs")

const { successResponse } = require("../handler/responseHandler")
const { handleBanUserAction, handleUnBanUserAction, findAllUsers, findSingleUser, deleteUserAction, updateUserAction, updatePasswordAction, forgetPasswordAction, resetPasswordAction, userRegisterAction, userActivateAction } = require("../services/userService")

// register a user
const registerUser = async (req, res, next) => {
    try {
        await userRegisterAction(req)
        return successResponse(res, {
            statusCode: 200,
            message: "please check your email",
        })
    } catch (error) {
        next(error)
    }
}

// activate user
const activateUserAccount = async (req, res, next) => {
    try {
        const { token } = req.body
        await userActivateAction(token)
        return successResponse(res, {
            statusCode: 201,
            message: "user registered successfully"
        })
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            next(createError(401, "Token has expired"))
        } else if (error.name === "JsonWebTokenError") {
            next(createError(401, "Inavlid Token"))
        } else {
            next(error)
        }
    }
}

// get all users
const getUsers = async (req, res, next) => {
    try {
        const search = req.query.search || ""
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5

        const { users, pagination } = await findAllUsers(search, page, limit)

        return successResponse(res, {
            statusCode: 200,
            message: "users returned successfully",
            payload: {
                users,
                pagination,
            }
        })
    } catch (error) {
        next(error)
    }
}

// get single user by id
const getSingleUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const user = await findSingleUser(userId)
        return successResponse(res, {
            statusCode: 200,
            message: "user returned successfully",
            payload: {
                user
            }
        })
    } catch (error) {
        next(error)
    }
}

// delete a user
const handleDeleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        await deleteUserAction(userId)
        return successResponse(res, {
            statusCode: 200,
            message: "user deleted successfully"
        })

    } catch (error) {
        next(error)
    }
}

// updating a user
const handleUpdateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const updatedUser = await updateUserAction(userId, req)
        return successResponse(res, {
            statusCode: 200,
            message: 'user updated successfully',
            payload: {
                updatedUser
            }
        })

    } catch (error) {
        next(error)
    }
}

// ban user
const handleBanUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        await handleBanUserAction(userId)
        return successResponse(res, {
            statusCode: 200,
            message: "user banned successfully",
        })
    } catch (error) {
        next(error)
    }
}

// unban user
const handleUnBanUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        await handleUnBanUserAction(userId)
        return successResponse(res, {
            statusCode: 200,
            message: "user unbanned successfully",
        })
    } catch (error) {
        next(error)
    }
}

// update password
const handleUpdatePassword = async (req, res, next) => {
    try {
        const { newPassword } = req.body
        const userId = req.user._id
        const updatedUser = await updatePasswordAction(userId, newPassword)
        return successResponse(res, {
            statusCode: 200,
            message: "password updated successfully",
            payload: {
                updatedUser
            }
        })
    } catch (error) {
        next(error)
    }
}

// forget password
const handleForgetPassword = async (req, res, next) => {
    try {
        const { email } = req.body
        await forgetPasswordAction(email)
        return successResponse(res, {
            statusCode: 200,
            message: "please check your email",
        })
    } catch (error) {
        next(error)
    }
}

// reset password
const handleResetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body
        await resetPasswordAction(token, newPassword)
        return successResponse(res, {
            statusCode: 200,
            message: "password reset successfully"
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    getUsers,
    getSingleUser,
    handleDeleteUser,
    registerUser,
    activateUserAccount,
    handleUpdateUser,
    handleBanUser,
    handleUnBanUser,
    handleUpdatePassword,
    handleForgetPassword,
    handleResetPassword
}