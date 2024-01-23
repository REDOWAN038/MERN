const createError = require("http-errors")
const fs = require("fs")
const userModel = require("../models/userModel")
const { successResponse } = require("../handler/responseHandler")
const { default: mongoose } = require("mongoose")
const deleteImage = require("../handler/deleteImage")
const { createJWT } = require("../handler/jwt")
const { jwtActivationKey } = require("../src/secret")

// register a user
const registerUser = async(req,res,next)=>{
    try {
        const {name, email, password, address, phone} = req.body

        const existingUser = await userModel.findOne({
            $or: [
            { email },
            { phone }
            ]
        })

        if(existingUser){
            throw createError(409, "user already exists by this mail or phone")
        }

        const newUser = {name, email, password, address, phone}

        const token = createJWT(newUser, jwtActivationKey, "10m")

        return successResponse(res,{
            statusCode : 200,
            message : "user registered successfully",
            payload : {token}
        })
    } catch (error) {
        next(error)
    }
}

// get all users
const getUsers = async (req,res,next)=>{
    try {
        const search = req.query.search || ""
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5

        const searchRegExp = new RegExp(".*" + search + ".*", "i")

        const filter = {
            isAdmin : {$ne : true},
            $or : [
                {name : {$regex : searchRegExp}},
                {email : {$regex : searchRegExp}},
                {phone : {$regex : searchRegExp}},
            ]
        }

        const options = {
            password : 0
        }

        const users = await userModel.find(filter, options).limit(limit).skip((page-1)*limit)
        const totalUsers = await userModel.find(filter).countDocuments()

        if(!users){
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

        return successResponse(res,{
            statusCode : 200,
            message : "users returned successfully",
            payload : {
                users,
            pagination : {
                totalPages : Math.ceil(totalUsers/limit),
                currentPage : page,
                previousPage : page-1>0 ? page-1 : null,
                nextPage : page+1<=Math.ceil(totalUsers/limit)?page+1:null
            }
            }
        })
    } catch (error) {
        next(error)
    }
}

// get single user by id
const getSingleUser = async (req,res,next)=>{
    try {
        const id = req.params.id
        const options = {password : 0}
        const user = await userModel.findById(id, options)

        if(!user){
            throw createError(404, "user does not exist by this id")
        }

        return successResponse(res,{
            statusCode : 200,
            message : "user returned successfully",
            payload : {
                user
            }
        })
    } catch (error) {
        if(error instanceof mongoose.Error){
            next(createError(400, "Invalid user id"))
            return
        }
        next(error)
    }
}

// delete a user
const deleteUser = async(req,res,next)=>{
    try {
        const id = req.params.id
        const deletedUser = await userModel.findByIdAndDelete(id,{
            isAdmin:false
        })

        if(!deletedUser){
            throw createError(404, "user not found")
        }

        const userImagePath = deletedUser.image
        deleteImage(userImagePath)

        return successResponse(res,{
            statusCode : 200,
            message : "user deleted successfully"
        })

    } catch (error) {
        if(error instanceof mongoose.Error){
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
    registerUser
}