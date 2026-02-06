import { createIncome, getAllIncomes } from "../models/Income.js";
import AppError from "../utils/AppError.js";

export const addIncome = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { icon, source, amount, date } = req.body;

        const errors = [];
        if (!source) errors.push("Source can not be empty");
        if (!amount) errors.push("Amount can not be empty");
        
        if (amount <= 0) {
            throw new AppError(
                'Amount must be greater than 0',
                400
            )
        }

        const income = await createIncome({
            userId,
            icon,
            source,
            amount,
            date
        });

        return res.status(201).json(income);
    } catch(error) {
        next(error);
    }
};

export const getAllIncome = async (req, res, next) => {
    try {
        console.log(req.user);
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

        return res.status(201).json(allIncomes);
    } catch (error) {
        console.log(error);
        
        next(error);
    }
};

export const downloadIncomeExcelFormat = (req, res, next) => {};

export const deleteIncome = (req, res, next) => {};
