const express = require("express")
const { getUsers, getSingleUser, deleteUser, registerUser } = require("../controllers/userControllers")
const router = express.Router()

// register an user
router.post("/register", registerUser)

// get all users
router.get("/", getUsers)

// get single user
router.get("/:id", getSingleUser)

// delete user
router.delete("/:id", deleteUser)

module.exports = router