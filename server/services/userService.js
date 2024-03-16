const createError = require("http-errors")
const userModel = require("../models/userModel")

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
    handleUnBanUserAction
}