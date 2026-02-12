import * as categoryService from "../services/categoryService.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/response.js";

export const addCategory = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { categoryName, icon } = req.body;

        const errors = [];

        if (!categoryName || !categoryName.trim()) errors.push("Category name is required");

        if (errors.length) {
            throw new AppError("Validation error", 400, errors);
        }

        const category = await categoryService.create({
            userId,
            categoryName: categoryName.trim(),
            icon: icon?.trim() || null
        });

        const responseData = successResponse({
            message: "Category created successfully",
            data: category,
            statusCode: 201
        });

        res.status(201).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const getCategory = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { categoryId } = req.params;

        const category = await categoryService.getById(userId, categoryId);

        const responseData = successResponse({
            message: "Category retrieved successfully",
            data: category,
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { categoryId } = req.params;
        const reqData = req.body;

        const errors = [];
        if (!reqData.categoryName || !reqData.categoryName.trim()) {
            errors.push("Category name is required");
        }

        if (errors.length) {
            throw new AppError("Validation error", 400, errors);
        }

        const category = await categoryService.update(categoryId, userId, reqData);

        const responseData = successResponse({
            message: "Category updated successfully",
            data: category,
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};