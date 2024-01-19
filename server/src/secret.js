require("dotenv").config()
const port = process.env.SERVER_PORT || 5000
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/MERN"

module.exports = {port, mongoURL}