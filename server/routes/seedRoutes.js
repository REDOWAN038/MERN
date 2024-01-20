const express = require("express")
const { seedUser } = require("../controllers/seedController")
const router = express.Router()

router.post("/", seedUser)

module.exports = router