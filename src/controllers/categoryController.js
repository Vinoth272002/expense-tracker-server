import { createCategory } from "../models/Categories.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/response.js";

export const addCategory = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { categoryName, icon } = req.body;

        const erros = [];

        if (!categoryName || !categoryName.trim()) erros.push("Category name is required");
        if (erros.length) {
            throw new AppError(
                "Validation error",
                400,
                erros
            )
        };

        const category = await createCategory({
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
}