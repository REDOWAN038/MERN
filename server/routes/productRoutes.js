const express = require("express")
const { handleCreateProduct, handleGetProducts, handleGetProduct, handleDeleteProduct, handleUpdateProduct } = require("../controllers/productController")
const { validateProduct } = require("../middlewares/validation")
const { isLoggedIn, isAdmin } = require("../middlewares/auth")
const { uploadImage } = require("../middlewares/uploadingImage")
const { runValidation } = require("../middlewares")
const router = express.Router()

// create product
router.post("/", uploadImage.single("image"), isLoggedIn, isAdmin, validateProduct, runValidation, handleCreateProduct)

// get products
router.get("/", handleGetProducts)

// get product
router.get("/:slug", handleGetProduct)

// delete product
router.delete("/:slug", isLoggedIn, isAdmin, handleDeleteProduct)

// update product
router.put("/:slug", uploadImage.single("image"), isLoggedIn, isAdmin, handleUpdateProduct)

module.exports = router