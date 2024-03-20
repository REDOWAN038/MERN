const express = require("express")
const { handleCreateCategory } = require("../controllers/categoryController")
const { validateCategory } = require("../middlewares/validation")
const { isLoggedIn, isAdmin } = require("../middlewares/auth")
const { runValidation } = require("../middlewares")
const router = express.Router()

// create category
router.post("/", validateCategory, runValidation, isLoggedIn, isAdmin, handleCreateCategory)

module.exports = router