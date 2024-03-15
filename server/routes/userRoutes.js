const express = require("express")
const { getUsers, getSingleUser, deleteUser, registerUser, activateUserAccount, updateUser } = require("../controllers/userControllers")
const { validateUserRegistration } = require("../middlewares/auth")
const { runValidation } = require("../middlewares")
const { uploadUserImage } = require("../middlewares/uploadingUserImage")
const router = express.Router()

// register an user
router.post("/register", uploadUserImage.single("image"), validateUserRegistration, runValidation, registerUser)

// activate user account
router.post("/activate", activateUserAccount)

// get all users
router.get("/", getUsers)

// get single user
router.get("/:id", getSingleUser)

// delete user
router.delete("/:id", deleteUser)

// update user
router.put("/:id", uploadUserImage.single("image"), updateUser)

module.exports = router