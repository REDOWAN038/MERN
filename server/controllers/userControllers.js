const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const userModel = require("../models/userModel")
const { successResponse } = require("../handler/responseHandler")
const { createJWT } = require("../handler/jwt")
const { jwtActivationKey, clientURL } = require("../src/secret")
const { sendingMail } = require("../handler/email")
const { handleBanUserAction, handleUnBanUserAction, findAllUsers, findSingleUser, deleteUserAction, updateUserAction, updatePasswordAction } = require("../services/userService")

// register a user
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password, address, phone } = req.body
        const image = req.file?.path

        const existingUser = await userModel.findOne({
            $or: [
                { email },
                { phone }
            ]
        })

        if (existingUser) {
            throw createError(409, "user already exists by this mail or phone")
        }

        const newUser = { name, email, password, address, phone, image }

        const token = createJWT(newUser, jwtActivationKey, "10m")

        const emailData = {
            email,
            subject: "Activate Your Account",
            html: `
            <h2> Hello ${name} </h2>
            <p> please click here to <a href="${clientURL}/api/v1/users/activate/${token}" target="_blank"> activate your account </a> </p>
            `
        }

        try {
            // await sendingMail(emailData)

        } catch (error) {
            createError(500, "failed to send activation email")
            next()
            return
        }

        return successResponse(res, {
            statusCode: 200,
            message: "please check your email",
            payload: { token }
        })
    } catch (error) {
        next(error)
    }
}

// activate user
const activateUserAccount = async (req, res, next) => {
    try {
        const token = req.body.token

        if (!token) {
            throw createError(404, "token is not found")
        }

        const decoded = jwt.verify(token, jwtActivationKey)
        const existingUser = await userModel.findOne({
            email: decoded.email
        })

        if (existingUser) {
            throw createError(409, "user already exists by this mail")
        }

        const image = decoded.image

        if (image) {
            const response = await cloudinary.uploader.upload(image, {
                folder: "MERN/users"
            })
            decoded.image = response.secure_url
        }

        const user = await userModel.create(decoded)

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

module.exports = {
    getUsers,
    getSingleUser,
    handleDeleteUser,
    registerUser,
    activateUserAccount,
    handleUpdateUser,
    handleBanUser,
    handleUnBanUser,
    handleUpdatePassword
}