const express = require("express")
const { handleCreateProduct } = require("../controllers/productController")
const { validateProduct } = require("../middlewares/validation")
const { isLoggedIn, isAdmin } = require("../middlewares/auth")
const { uploadImage } = require("../middlewares/uploadingImage")
const { runValidation } = require("../middlewares")
const router = express.Router()

// create product
router.post("/", uploadImage.single("image"), isLoggedIn, isAdmin, validateProduct, runValidation, handleCreateProduct)

module.exports = router