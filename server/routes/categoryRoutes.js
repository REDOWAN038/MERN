const express = require("express")
const { handleCreateCategory, handleGetCategories, handleGetCategory } = require("../controllers/categoryController")
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

module.exports = router