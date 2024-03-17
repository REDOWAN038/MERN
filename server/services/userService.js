const createError = require("http-errors")
const mongoose = require("mongoose")
const jwt = require("jsonwebtoken")

const userModel = require("../models/userModel")
const cloudinary = require("../config/cloudinary")
const { getPublicId } = require("../handler/cloudinary")
const { createJWT } = require("../handler/jwt")
const { jwtResetPasswordKey, clientURL, jwtActivationKey } = require("../src/secret")

// register user
const userRegisterAction = async (req) => {
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
    } catch (error) {
        throw error
    }
}

// activate user
const userActivateAction = async (token) => {
    try {
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
    } catch (error) {
        throw error
    }
}

// find all users
const findAllUsers = async (search, page, limit) => {
    try {
        const searchRegExp = new RegExp(".*" + search + ".*", "i")

        const filter = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegExp } },
                { email: { $regex: searchRegExp } },
                { phone: { $regex: searchRegExp } },
            ]
        }

        const options = {
            password: 0
        }

        const users = await userModel.find(filter, options).limit(limit).skip((page - 1) * limit)
        const totalUsers = await userModel.find(filter).countDocuments()

        if (!users || users.length === 0) {
            throw createError(404, "users not found")
        }

        return {
            users,
            pagination: {
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(totalUsers / limit) ? page + 1 : null
            }
        }
    } catch (error) {
        throw (error)
    }
}

// find single user
const findSingleUser = async (userId) => {
    try {
        const options = { password: 0 }
        const user = await userModel.findById(userId, options)

        if (!user) {
            throw createError(404, "user does not exist by this id")
        }

        return user
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid User id")
        }
        throw (error)
    }
}

// delete user
const deleteUserAction = async (userId) => {
    try {
        const user = await userModel.findById(userId)

        if (!user) {
            throw createError(404, "user not found")
        }

        const userImagePath = user.image
        const publicId = await getPublicId(userImagePath)

        const { result } = await cloudinary.uploader.destroy(`MERN/users/${publicId}`)

        if (result !== "ok") {
            throw createError(400, "please try again")
        }

        await userModel.findByIdAndDelete(userId)
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid User id")
        }
        throw error
    }
}

// update user
const updateUserAction = async (userId, req) => {
    try {
        const user = await userModel.findById(userId)
        if (!user) {
            throw createError(404, "user not found")
        }
        const updateOptions = { new: true, runValidators: true, context: 'query' }
        let updates = {}
        const allowedFields = ['name', 'password', 'address']

        for (let key in req.body) {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key]
            } else if (['email'].includes(key)) {
                throw new Error("email can not be updated")
            } else if (['phone'].includes(key)) {
                const phone = req.body[key]
                const temp = await userModel.findOne({ phone })
                if (temp) {
                    throw new Error("this phone number is aleady used")
                }
            }
        }

        const image = req.file?.path

        if (image) {
            const response = await cloudinary.uploader.upload(image, {
                folder: "MERN/users"
            })
            updates.image = response.secure_url

            const publicId = await getPublicId(user.image)

            const { result } = await cloudinary.uploader.destroy(`MERN/users/${publicId}`)

            if (result !== "ok") {
                throw createError(400, "please try again")
            }
        }

        const updatedUser = await userModel.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select("-password")

        if (!updatedUser) {
            throw createError(404, "user with this id does not exist.")
        }

        return updatedUser
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid User id")
        }
        throw error
    }
}

// ban user
const handleBanUserAction = async (userId) => {
    try {
        const user = await userModel.findById(userId)

        if (!user) {
            throw createError(404, "user with this id does not exist.")
        }

        if (user.isBanned) {
            throw Error("user already banned")
        }

        const options = { new: true, runValidators: true, context: 'query' }
        const updates = { isBanned: true }

        const bannedUser = await userModel.findByIdAndUpdate(
            userId,
            updates,
            options
        ).select("-password")
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid User id")
        }
        throw (error)
    }
}

// unban user
const handleUnBanUserAction = async (userId) => {
    try {
        const user = await userModel.findById(userId)

        if (!user) {
            throw createError(404, "user with this id does not exist.")
        }

        if (!user.isBanned) {
            throw Error("user already unbanned")
        }

        const options = { new: true, runValidators: true, context: 'query' }
        const updates = { isBanned: false }

        const unBannedUser = await userModel.findByIdAndUpdate(
            userId,
            updates,
            options
        ).select("-password")
    } catch (error) {
        if (error instanceof mongoose.Error.CastError) {
            throw createError(400, "Invalid User id")
        }
        throw (error)
    }
}

// update password
const updatePasswordAction = async (userId, newPassword) => {
    try {
        const user = await userModel.findById(userId)

        if (!user) {
            throw createError(404, "user is not found")
        }

        const updates = { password: newPassword }
        const updateOptions = { new: true, runValidators: true, context: 'query' }

        const updatedUser = await userModel.findByIdAndUpdate(userId, updates, updateOptions).select("-password")

        if (!updatedUser) {
            throw createError(400, "password is not updated... try again!!!")
        }

        return updatedUser
    } catch (error) {
        throw error
    }
}

// forget password
const forgetPasswordAction = async (email) => {
    try {
        const user = await userModel.findOne({ email })
        if (!user) {
            throw createError(404, "user does not exist")
        }

        const token = createJWT({ email }, jwtResetPasswordKey, "10m")

        const emailData = {
            email,
            subject: "Reset Your Password",
            html: `
            <h2> Hello ${user.name} </h2>
            <p> please click here to <a href="${clientURL}/api/v1/users/reset-password/${token}" target="_blank"> reset your account password </a> </p>
            `
        }

        try {
            // await sendingMail(emailData)

        } catch (error) {
            createError(500, "failed to send reset password email")
            next()
            return
        }
    } catch (error) {
        throw error
    }
}

// reset password
const resetPasswordAction = async (token, newPassword) => {
    try {
        const decoded = jwt.verify(token, jwtResetPasswordKey)
        if (!decoded) {
            throw createError(400, "Invalid or Expired token")
        }

        const user = await userModel.findOne({
            email: decoded.email
        })

        if (!user) {
            throw createError(404, "user does not exists by this mail")
        }

        const filter = { email: decoded.email }
        const updates = { password: newPassword }
        const options = { new: true }

        const updatedUser = await userModel.findOneAndUpdate(
            filter,
            updates,
            options
        ).select("-password")

        if (!updatedUser) {
            throw createError(400, "password reset failed")
        }
    } catch (error) {
        throw error
    }
}

module.exports = {
    handleBanUserAction,
    handleUnBanUserAction,
    findAllUsers,
    findSingleUser,
    deleteUserAction,
    updateUserAction,
    updatePasswordAction,
    forgetPasswordAction,
    resetPasswordAction,
    userRegisterAction,
    userActivateAction
}