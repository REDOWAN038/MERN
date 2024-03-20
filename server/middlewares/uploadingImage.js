const multer = require("multer")
const { allowedImageTypes, uploadImageMaxSize } = require("../config/image")


const imageStorage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (!allowedImageTypes.includes(file.mimetype)) {
    return cb(new Error("image type is not allowed"), false)
  }

  cb(null, true)
}

const uploadImage = multer({
  storage: imageStorage,
  limits: { fileSize: uploadImageMaxSize },
  fileFilter
})

module.exports = { uploadImage }