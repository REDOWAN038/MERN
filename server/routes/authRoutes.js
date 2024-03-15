const express = require("express")
const { handleLogin, handleLogout } = require("../controllers/authController")
const router = express.Router()

// user logged in
router.post("/login", handleLogin)

// user logged out
router.post("/logout", handleLogout)

module.exports = router