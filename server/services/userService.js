const createError = require("http-errors")
const userModel = require("../models/userModel")

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
        throw (error)
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
        throw (error)
    }
}

module.exports = {
    handleBanUserAction,
    handleUnBanUserAction,
    findAllUsers,
    findSingleUser
}