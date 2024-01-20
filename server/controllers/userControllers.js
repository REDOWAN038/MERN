const createError = require("http-errors")
const userModel = require("../models/userModel")
const { successResponse } = require("../handler/responseHandler")
// get all users
const getUsers = async (req,res,next)=>{
    try {
        const search = req.query.search || ""
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 1

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

module.exports = {
    getUsers
}