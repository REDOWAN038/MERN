const mongoose = require("mongoose")

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "product name is required"],
        trim: true,
        unique: true,
    },
    slug: {
        type: String,
        required: [true, "product slug is required"],
        lowercase: true,
        unique: true,
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    description: {
        type: String,
        required: [true, "product description is required"],
        trim: true,
        minlength: [10, "length of product description must be at least 10 characters"]
    },
    price: {
        type: Number,
        required: [true, "product price is required"],
        min: [0, "product price must be non-negative"]
    },
    quantity: {
        type: Number,
        required: [true, "product quantity is required"],
        min: [0, "product quantity must be non-negative"]
    },
    sold: {
        type: Number,
        required: [true, "product sold is required"],
        default: 0,
        min: [0, "product sold must be non-negative"]
    },
    shipping: {
        type: Number,
        default: 0
    },
    image: {
        type: String,
        required: [true, "product image is required"]
    }
}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)