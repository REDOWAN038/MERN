const categoryModel = require("../models/categoryModel")
const { successResponse } = require("../handler/responseHandler")
const { createCategoryService } = require("../services/categoryService")

// creating category
const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body
        await createCategoryService(name)
        return successResponse(res, {
            statusCode: 200,
            message: "category created successfully",
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleCreateCategory
}