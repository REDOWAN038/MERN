const categoryModel = require("../models/categoryModel")
const { successResponse } = require("../handler/responseHandler")
const { createCategoryService, getCategoriesService, getCategoryService, updateCategoryService } = require("../services/categoryService")

// creating category
const handleCreateCategory = async (req, res, next) => {
    try {
        const { name } = req.body
        await createCategoryService(name)
        return successResponse(res, {
            statusCode: 201,
            message: "category created successfully",
        })
    } catch (error) {
        next(error)
    }
}

// get categories
const handleGetCategories = async (req, res, next) => {
    try {
        const categories = await getCategoriesService()
        return successResponse(res, {
            statusCode: 200,
            message: "categories fetched successfully",
            payload: {
                categories
            }
        })
    } catch (error) {
        next(error)
    }
}

// get category
const handleGetCategory = async (req, res, next) => {
    try {
        const { slug } = req.params
        const category = await getCategoryService(slug)
        return successResponse(res, {
            statusCode: 200,
            message: "category fetched successfully",
            payload: {
                category
            }
        })
    } catch (error) {
        next(error)
    }
}

// update category
const handleUpdateCategory = async (req, res, next) => {
    try {
        const { slug } = req.params
        const { name } = req.body
        await updateCategoryService(name, slug)
        return successResponse(res, {
            statusCode: 200,
            message: "category updated successfully",
        })
    } catch (error) {
        next(error)
    }
}

module.exports = {
    handleCreateCategory,
    handleGetCategories,
    handleGetCategory,
    handleUpdateCategory
}