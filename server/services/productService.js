const slugify = require("slugify")
const createError = require("http-errors")

const productModel = require("../models/productModel")
const cloudinary = require("../config/cloudinary")
const { getPublicId } = require("../handler/cloudinary")

// create product
const createProductService = async (productData) => {
    try {
        const { name, category, description, price, quantity, shipping, image } = productData

        const existingProduct = await productModel.findOne({ slug: slugify(name) })
        if (existingProduct) {
            throw createError(409, "product already exists")
        }

        const response = await cloudinary.uploader.upload(image, {
            folder: "MERN/products"
        })

        const product = await productModel.create({
            name,
            slug: slugify(name),
            category,
            description,
            price,
            quantity,
            shipping,
            image: response.secure_url
        })

        return product

    } catch (error) {
        throw error
    }
}

module.exports = {
    createProductService
}