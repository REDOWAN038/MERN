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
        const category = await categoryModel.find({ slug }).select("name slug").lean()

        if (!category) {
            throw createError(404, "no such category found")
        }

        return category
    } catch (error) {
        throw error
    }
}

// update category
const updateCategoryService = async (name, slug) => {
    try {
        const updates = { name, slug: slugify(name) }
        const options = { new: true }

        const updatedCategory = await categoryModel.findOneAndUpdate({ slug }, updates, options)

        if (!updatedCategory) {
            throw createError(404, "no such category found")
        }
    } catch (error) {
        throw error
    }
}

// delete category
const deleteCategoryService = async (slug) => {
    try {
        const deletedCategory = await categoryModel.findOneAndDelete({ slug })

        if (!deletedCategory) {
            throw createError(404, "no such category found")
        }
    } catch (error) {
        throw error
    }
}

// delete categorries
const deleteCategoriesService = async () => {
    try {
        await categoryModel.deleteMany({})
    } catch (error) {
        throw error
    }
}

module.exports = {
    createCategoryService,
    getCategoriesService,
    getCategoryService,
    updateCategoryService,
    deleteCategoryService,
    deleteCategoriesService
}