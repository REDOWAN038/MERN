const express = require("express")
const { getUsers, getSingleUser } = require("../controllers/userControllers")
const router = express.Router()

// get all users
router.get("/", getUsers)

// get single user
router.get("/:id", getSingleUser)

module.exports = router