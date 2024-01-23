const fs = require("fs").promises

const deleteImage = async (imagePath)=>{
	try {
		await fs.access(imagePath)
		await fs.unlink(imagePath)
		console.log("user image deleted successfully")
	} catch (error) {
		console.error("user image does not exist")
	}
}

module.exports = deleteImage