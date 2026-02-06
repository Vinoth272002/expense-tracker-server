import { createIncome, getAllIncomes } from "../models/Income.js";
import AppError from "../utils/AppError.js";

export const addIncome = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { icon, source, amount, date } = req.body;

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
            date
        });

        return res.status(201).json(income);
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

        return res.status(200).json(allIncomes);
    } catch (error) {
        console.log(error);
        
        next(error);
    }
};

export const downloadIncomeExcelFormat = (req, res, next) => {};

export const deleteIncome = (req, res, next) => {};
