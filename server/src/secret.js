require("dotenv").config()
const port = process.env.SERVER_PORT || 5000
const mongoURL = process.env.MONGO_URL || "mongodb://localhost:27017/MERN"
const defaultUserImagePath = process.env.DEFAULT_USER_IMAGE_PATH || "public/images/users/default.png"
const jwtActivationKey = process.env.JWT_ACTIVATION_KEY
const smtpUser = process.env.SMTP_USER || ""
const smtpPassword = process.env.SMTP_PASS || ""
const clientURL = process.env.CLIENT_URL || ""
const cloudName = process.env.CLOUDINARY_NAME
const cloudApiKey = process.env.CLOUDINARY_API_KEY
const cloudSecretKey = process.env.CLOUDINARY_SECRET_KEY

module.exports = {
 	port, 
 	mongoURL, 
 	defaultUserImagePath, 
 	jwtActivationKey, 
 	smtpUser, 
 	smtpPassword,
	clientURL,
    cloudName,
    cloudApiKey,
    cloudSecretKey
}