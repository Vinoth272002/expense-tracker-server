import * as categoryRepository from "../repositories/categoryRepository.js";
import * as categoryMapper from "../mappers/categoryMapper.js";
import { buildUpdateQuery } from "../utils/buildUpdateQuery.js";
import AppError from "../utils/AppError.js";

export const create = async ({ userId, categoryName, icon }) => {
    const rawCategory = await categoryRepository.createCategory({
        userId, categoryName, icon
    });

    return categoryMapper.mapOne(rawCategory);
};

export const getById = async (userId, categoryId) => {
    const rawCategory = await categoryRepository.findCategoryById({ userId, categoryId });

    if (!rawCategory) {
        throw new AppError(
            "Category not found",
            404,
            ["No category found with the provided ID"]
        );
    }

    return categoryMapper.mapOne(rawCategory);
};

export const getAll = async (userId) => {
    const rawCategory = await categoryRepository.getAllCategories({ userId });

    return categoryMapper.mapMany(rawCategory);
};

export const update = async (categoryId, userId, data) => {
    const { query, values } = buildUpdateQuery({
        table: "categories",
        allowedFields: ["categoryName", "icon"],
        data,
        conditions: {
            category_id: categoryId,
            user_id: userId
        }
    });

    const rawCategory = await categoryRepository.updateCategoryById({ query, values });

    if (!rawCategory) {
        throw new AppError("Category not found", 404);
    }

    return categoryMapper.mapOne(rawCategory);
};

export const remove = async (categoryId, userId) => {
    const rawCategory = await categoryRepository.deleteCategoryById({ categoryId, userId });

    return categoryMapper.mapOne(rawCategory);
}
