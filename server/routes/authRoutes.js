const express = require("express")
const { handleLogin, handleLogout } = require("../controllers/authController")
const { isLoggedOut, isLoggedIn } = require("../middlewares/auth")
const router = express.Router()

// user logged in
router.post("/login", isLoggedOut, handleLogin)

// user logged out
router.post("/logout", isLoggedIn, handleLogout)

module.exports = router