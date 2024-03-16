const express = require("express")
const { getUsers, getSingleUser, registerUser, activateUserAccount, handleUpdateUser, handleBanUser, handleUnBanUser, handleDeleteUser, handleUpdatePassword } = require("../controllers/userControllers")
const { validateUserRegistration, validateUpdatePasswordLogin } = require("../middlewares/validation")
const { runValidation } = require("../middlewares")
const { uploadUserImage } = require("../middlewares/uploadingUserImage")
const { isLoggedIn, isLoggedOut, isAdmin } = require("../middlewares/auth")
const router = express.Router()

// register an user
router.post("/register", uploadUserImage.single("image"), isLoggedOut, validateUserRegistration, runValidation, registerUser)

// activate user account
router.post("/activate", isLoggedOut, activateUserAccount)

// update password
router.put("/update-password", validateUpdatePasswordLogin, runValidation, isLoggedIn, handleUpdatePassword)

// get all users
router.get("/", isLoggedIn, isAdmin, getUsers)

// get single user
router.get("/:id", isLoggedIn, getSingleUser)

// delete user
router.delete("/:id", isLoggedIn, handleDeleteUser)

// update user
router.put("/:id", uploadUserImage.single("image"), isLoggedIn, handleUpdateUser)

// ban user
router.put("/ban-user/:id", isLoggedIn, isAdmin, handleBanUser)

// unban user
router.put("/unban-user/:id", isLoggedIn, isAdmin, handleUnBanUser)

module.exports = router