const slugify = require("slugify")
const createError = require("http-errors")

const categoryModel = require("../models/categoryModel")

// create category
const createCategoryService = async (name) => {
    try {
        const category = await categoryModel.findOne({ name })

        if (category) {
            throw createError(409, `${name} category is already available`)
        }

        await categoryModel.create({
            name,
            slug: slugify(name)
        })
    } catch (error) {
        throw error
    }
}

// get categories
const getCategoriesService = async () => {
    try {
        return await categoryModel.find({}).select("name slug").lean()
    } catch (error) {
        throw error
    }
}

// get category
const getCategoryService = async (slug) => {
    try {
        return await categoryModel.find({ slug }).select("name slug").lean()
    } catch (error) {
        throw error
    }
}

module.exports = {
    createCategoryService,
    getCategoriesService,
    getCategoryService
}