const express = require("express")
const { getUsers, getSingleUser, deleteUser, registerUser, activateUserAccount } = require("../controllers/userControllers")
const router = express.Router()

// register an user
router.post("/register", registerUser)

// activate user account
router.post("/activate", activateUserAccount)

// get all users
router.get("/", getUsers)

// get single user
router.get("/:id", getSingleUser)

// delete user
router.delete("/:id", deleteUser)

module.exports = router