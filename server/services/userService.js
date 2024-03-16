const createError = require("http-errors")
const mongoose = require("mongoose")

const userModel = require("../models/userModel")
const cloudinary = require("../config/cloudinary")
const { getPublicId } = require("../handler/cloudinary")

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

        if (!users) {
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

        for (let key in req.body) {
            if (['name', 'password', 'address'].includes(key)) {
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

module.exports = {
    handleBanUserAction,
    handleUnBanUserAction,
    findAllUsers,
    findSingleUser,
    deleteUserAction,
    updateUserAction,
    updatePasswordAction
}