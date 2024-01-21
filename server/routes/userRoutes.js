const express = require("express")
const { getUsers, getSingleUser, deleteUser } = require("../controllers/userControllers")
const router = express.Router()

// get all users
router.get("/", getUsers)

// get single user
router.get("/:id", getSingleUser)

// delete user
router.delete("/:id", deleteUser)

module.exports = router