const express = require("express")
const { handleCreateCategory, handleGetCategories, handleGetCategory, handleUpdateCategory } = require("../controllers/categoryController")
const { validateCategory } = require("../middlewares/validation")
const { isLoggedIn, isAdmin } = require("../middlewares/auth")
const { runValidation } = require("../middlewares")
const router = express.Router()

// create category
router.post("/", validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory)

// get categories
router.get("/", handleGetCategories)

// get category
router.get("/:slug", handleGetCategory)

// update category
router.put("/:slug", validateCategory, runValidation, isLoggedIn, isAdmin, handleUpdateCategory)

module.exports = router