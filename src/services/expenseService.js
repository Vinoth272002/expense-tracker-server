import * as expenseRepository from "../repositories/expenseRepository.js";
import * as expenseMapper from "../mappers/expenseMapper.js";
import { buildUpdateQuery } from "../utils/buildUpdateQuery.js";
import AppError from "../utils/AppError.js";

export const create = async ({ userId, icon, source, amount, date, notes, categoryId }) => {
    const rawExpense = await expenseRepository.createExpense({
        userId, icon, source, amount, date, notes, categoryId
    });

    return expenseMapper.mapOne(rawExpense);
};

export const getAll = async (userId) => {
    const rawExpenses = await expenseRepository.getAllExpenses({ userId });

    return expenseMapper.mapMany(rawExpenses);
};

export const getById = async (expenseId, userId) => {
    const rawExpense = await expenseRepository.findExpenseById({ expenseId, userId });

    if (!rawExpense) {
        throw new AppError("Expense not found", 404, ["Expense not found"]);
    }

    return expenseMapper.mapOne(rawExpense);
};

export const update = async (expenseId, userId, data) => {
    const { query, values } = buildUpdateQuery({
        table: "expenses",
        allowedFields: ["amount", "icon", "source", "notes", "date"],
        data,
        conditions: {
            id: expenseId,
            user_id: userId
        }
    });

    const rawExpense = await expenseRepository.updateExpenseById({ query, values });

    if (!rawExpense) {
        throw new AppError("Expense not found", 404);
    }

    return expenseMapper.mapOne(rawExpense);
};

export const remove = async (expenseId, userId) => {
    const rawExpense = await expenseRepository.deleteExpenseById({ expenseId, userId });

    return expenseMapper.mapOne(rawExpense);
};

export const exportAll = async (userId) => {
    const rawExpenses = await expenseRepository.getAllExpensesForExport({ userId });

    return expenseMapper.mapMany(rawExpenses);
};
