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

module.exports = {
    createCategoryService
}