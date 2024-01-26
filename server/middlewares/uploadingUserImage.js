const multer = require("multer")
// const path = require("path")
// const createError = require("http-errors")
const { allowedImageTypes, uploadUserImageMaxSize } = require("../config/userImage")

const storage = multer.memoryStorage()

const fileFilter = (req,file,cb)=>{
    if(!file.mimetype.startsWith("image/")){
        return cb(new Error("only image file is required"), false)
    }

    if(!allowedImageTypes.includes(file.mimetype)){
        return cb(new Error("image type is not allowed"), false)
    }

    cb(null, true)
}

const upload = multer({ 
    storage: storage,
    limits : {fileSize : uploadUserImageMaxSize},
    fileFilter
})

module.exports = {upload}