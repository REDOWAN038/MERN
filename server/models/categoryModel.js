const mongoose = require("mongoose")

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "category name is required"],
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "category slug is required"],
        lowercase: true,
        unique: true,
    }
}, { timestamps: true })

module.exports = mongoose.model("Category", categorySchema)