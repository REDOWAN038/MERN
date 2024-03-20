const express = require("express")
const { handleCreateCategory, handleGetCategories, handleGetCategory, handleUpdateCategory, handleDeleteCategory, handleDeleteCategories } = require("../controllers/categoryController")
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

// delete category
router.delete("/", isLoggedIn, isAdmin, handleDeleteCategories)

// delete category
router.delete("/:slug", isLoggedIn, isAdmin, handleDeleteCategory)

module.exports = router