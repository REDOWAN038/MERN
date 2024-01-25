const multer = require("multer")
const path = require("path")
const createError = require("http-errors")
const { uploadUserImagePath, allowedImageTypes, uploadUserImageMaxSize } = require("../config/userImage")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadUserImagePath)
  },
  filename: function (req, file, cb) {
    const extension = path.extname(file.originalname)
    cb(null, Date.now() + "-" + file.originalname)
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

const fileFilter = (req,file,cb)=>{
    const extension = path.extname(file.originalname)

    if(!allowedImageTypes.includes(extension.substring(1))){
        return cb(new Error("image file type is not allowed"), false)
    }

    cb(null, true)
}

const upload = multer({ 
    storage: storage,
    limits : {fileSize : uploadUserImageMaxSize},
    fileFilter
})

module.exports = {upload}