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

// get products
const getProductsService = async (search, page, limit, minPrice, maxPrice) => {
    try {
        const searchRegExp = new RegExp(".*" + search + ".*", "i")
        const filter = {
            name: { $regex: searchRegExp },
            price: { $gte: minPrice, $lte: maxPrice }
        }

        const products = await productModel
            .find(filter)
            .populate("category")
            .limit(limit)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 })

        if (!products || products.length === 0) {
            throw createError(404, "no products found")
        }

        const totalProducts = await productModel.find(filter).countDocuments()

        return {
            products,
            pagination: {
                totalPages: Math.ceil(totalProducts / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(totalProducts / limit) ? page + 1 : null
            }
        }
    } catch (error) {
        throw error
    }
}

// get single product
const getProductService = async (slug) => {
    try {
        const product = await productModel
            .findOne({ slug })
            .populate("category")

        if (!product) {
            throw createError(404, "no such product found")
        }

        return product

    } catch (error) {
        throw error
    }
}

module.exports = {
    createProductService,
    getProductsService,
    getProductService
}