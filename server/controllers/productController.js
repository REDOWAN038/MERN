
const { successResponse } = require("../handler/responseHandler")
const { createProductService } = require("../services/productService")

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

module.exports = {
    handleCreateProduct
}