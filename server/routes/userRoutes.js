const express = require("express")
const { getUsers } = require("../controllers/userControllers")
const router = express.Router()

// get all users
router.get("/", getUsers)

module.exports = router