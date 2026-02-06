import { createIncome, getAllIncomes } from "../models/Income.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/response.js";

export const addIncome = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { icon, source, amount, date, notes } = req.body;

        const errors = [];
        if (!source || !source.trim()) errors.push("Source is required");

        if (amount === undefined || amount === null) {
            errors.push("Amount is required");
        } else if (isNaN(amount)) {
            errors.push("Amount must be a number");
        } else if (Number(amount) <= 0) {
            errors.push("Amount must be greater than 0")
        }
        
        if (date) {
            const parseDate = new Date(date);

            if (isNaN(parseDate.getTime())) {
                errors.push("Invalid date format");
            } else if (parseDate > new Date()) {
                errors.push("Date cannot be in the future")
            }
        } else {
            date = new Date();
        }

        if (errors.length) {
            throw new AppError(
                "Validation error",
                400,
                errors
            )
        }

        const income = await createIncome({
            userId,
            icon,
            source: source.trim(),
            amount: Number(amount),
            date,
            notes: notes.trim()
        });

        const responseData = successResponse({
            message: "Income added successfully",
            data: income,
            statusCode:201
        });

        return res.status(201).json(responseData);
    } catch(error) {
        next(error);
    }
};

export const getAllIncome = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        
        if(!userId) {
            throw new AppError(
                'User ID must be precent',
                500
            )
        };

        const allIncomes = await getAllIncomes({
            userId
        });

        const responseData = successResponse({
            message: "Incomes retrieved successfully",
            data: allIncomes,
            statusCode: 200
        });

        return res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const downloadIncomeExcelFormat = (req, res, next) => {};

export const deleteIncome = async (req, res, next) => {
    try {
        const { incomeId } = Number(req.params);

        if (!incomeId || isNaN(incomeId)) {
            throw new AppError(
                "incomeId must be a valid number",
                400,
                ["incomeId is required and must be a valid number"]
            )
        }

        await deleteIncome(incomeId);

        const responseData = successResponse({
            message: "Income deleted successfully",
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};
