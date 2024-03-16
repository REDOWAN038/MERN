const createError = require("http-errors")
const jwt = require("jsonwebtoken")
const fs = require("fs")
const userModel = require("../models/userModel")
const { successResponse } = require("../handler/responseHandler")
const { default: mongoose } = require("mongoose")
const { createJWT } = require("../handler/jwt")
const { jwtActivationKey, clientURL } = require("../src/secret")
const { sendingMail } = require("../handler/email")
const cloudinary = require("../config/cloudinary")
const { getPublicId } = require("../handler/cloudinary")
const { handleBanUserAction, handleUnBanUserAction } = require("../services/userService")

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

        // res.status(200).send({
        //     success : true,
        //     message : "all users",
        //     users,
        //     pagination : {
        //         totalPages : Math.ceil(totalUsers/limit),
        //         currentPage : page,
        //         previousPage : page-1>0 ? page-1 : null,
        //         nextPage : page+1<=Math.ceil(totalUsers/limit)?page+1:null
        //     }
        // })

        return successResponse(res, {
            statusCode: 200,
            message: "users returned successfully",
            payload: {
                users,
                pagination: {
                    totalPages: Math.ceil(totalUsers / limit),
                    currentPage: page,
                    previousPage: page - 1 > 0 ? page - 1 : null,
                    nextPage: page + 1 <= Math.ceil(totalUsers / limit) ? page + 1 : null
                }
            }
        })
    } catch (error) {
        next(error)
    }
}

// get single user by id
const getSingleUser = async (req, res, next) => {
    try {
        const id = req.params.id
        const options = { password: 0 }
        const user = await userModel.findById(id, options)

        if (!user) {
            throw createError(404, "user does not exist by this id")
        }

        return successResponse(res, {
            statusCode: 200,
            message: "user returned successfully",
            payload: {
                user
            }
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user id"))
            return
        }
        next(error)
    }
}

// delete a user
const deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.id
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

        return successResponse(res, {
            statusCode: 200,
            message: "user deleted successfully"
        })

    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user id"))
            return
        }
        next(error)
    }
}

// updating a user
const handleUpdateUser = async (req, res, next) => {
    try {
        const userId = req.params.id
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

        return successResponse(res, {
            statusCode: 200,
            message: 'user updated successfully',
            payload: {
                updatedUser
            }
        })

    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user id"))
            return
        }
        next(error)
    }
}

// ban user
const handleBanUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        handleBanUserAction(userId)
        return successResponse(res, {
            statusCode: 200,
            message: "user banned successfully",
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user id"))
            return
        }
        next(error)
    }
}

// unban user
const handleUnBanUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        handleUnBanUserAction(userId)
        return successResponse(res, {
            statusCode: 200,
            message: "user unbanned successfully",
        })
    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user id"))
            return
        }
        next(error)
    }
}

module.exports = {
    getUsers,
    getSingleUser,
    deleteUser,
    registerUser,
    activateUserAccount,
    handleUpdateUser,
    handleBanUser,
    handleUnBanUser
}