require("dotenv").config()
const port = process.env.SERVER_PORT || 5000
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/MERN"
const defaultUserImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png"
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY

module.exports = {port, mongoURL, defaultUserImagePath, jwtActivationKey}