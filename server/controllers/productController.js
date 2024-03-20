
const { successResponse } = require("../handler/responseHandler")
const { createProductService, getProductsService, getProductService, deleteProductService, updateProductService } = require("../services/productService")

// create product
const handleCreateProduct = async (req, res, next) => {
    try {
        const image = req.file?.path
        const productData = { ...req.body, image }
        const product = await createProductService(productData)
        return successResponse(res, {
            statusCode: 201,
            message: "product created successfully",
            payload: {
                product
            }
        })
    } catch (error) {
        next(error)
    }
}

// get products
const handleGetProducts = async (req, res, next) => {
    try {
        const search = req.query.search || ""
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 5
        const minPrice = Number(req.query.minPrice) || 0
        const maxPrice = Number(req.query.maxPrice) || 100000000

        const { products, pagination } = await getProductsService(search, page, limit, minPrice, maxPrice)

        return successResponse(res, {
            statusCode: 200,
            message: "fetched all products",
            payload: {
                products,
                pagination
            }
        })
    } catch (error) {
        next(error)
    }
}

// get single product
const handleGetProduct = async (req, res, next) => {
    try {
        const { slug } = req.params
        const product = await getProductService(slug)
        return successResponse(res, {
            statusCode: 200,
            message: "product returned successfully",
            payload: {
                product
            }
        })
    } catch (error) {
        next(error)
    }
}

// delete product
const handleDeleteProduct = async (req, res, next) => {
    try {
        const { slug } = req.params
        await deleteProductService(slug)
        return successResponse(res, {
            statusCode: 200,
            message: "product deleted successfully",
        })
    } catch (error) {
        next(error)
    }
}

// update product
const handleUpdateProduct = async (req, res, next) => {
    try {
        const { slug } = req.params
        const updatedProduct = await updateProductService(slug, req)
        return successResponse(res, {
            statusCode: 200,
            message: "product updated successfully",
            payload: {
                updatedProduct
            }
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleCreateProduct,
    handleGetProducts,
    handleGetProduct,
    handleDeleteProduct,
    handleUpdateProduct
}