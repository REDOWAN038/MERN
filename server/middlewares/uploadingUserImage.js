const multer = require("multer")
const { allowedImageTypes, uploadUserImageMaxSize } = require("../config/userImage")


const userStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const fileFilter = (req,file,cb)=>{
    if(!allowedImageTypes.includes(file.mimetype)){
        return cb(new Error("image type is not allowed"), false)
    }

    cb(null, true)
}

const uploadUserImage = multer({ 
    storage: userStorage,
    limits : {fileSize : uploadUserImageMaxSize},
    fileFilter
})

module.exports = {uploadUserImage}