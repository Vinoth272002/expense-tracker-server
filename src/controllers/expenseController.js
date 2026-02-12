import { createExpense,
    getAllExpense,
    deleteExpenseById,
    findExpenseById,
    getAllExpenseForExport
} from "../models/Expense.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/response.js";
import ExcelJS from "exceljs";

export const addExpense = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { icon, source, amount, date, notes, categoryId } = req.body;

        // Validate the request data
        const errors = [];
        
        if (!categoryId || Number.isNaN(Number(categoryId))) errors.push("Category ID is required");

        const parsedAmount = Number(amount);
        if (amount === undefined || amount === null) {
            errors.push("Amount is required");
        } else if (Number.isNaN(parsedAmount)) {
            errors.push("Amount must be a number");
        } else if (parsedAmount <= 0) {
            errors.push("Amount must be greater than 0")
        }

        // Check the date if provided, otherwise set it to the current date
        let expenseDate = date ? new Date(date) : new Date();

        if (Number.isNaN(expenseDate.getTime())) {
            errors.push("Invalid date format");
        } else if (expenseDate > new Date()) {
            errors.push("Date cannot be in the future")
        }

        if (errors.length) {
            throw new AppError(
                "Validation error",
                400,
                errors
            )
        }

        const expense = await createExpense({
            userId,
            icon,
            source: source?.trim() || null,
            amount: parsedAmount,
            date: expenseDate,
            notes: notes?.trim() || null,
            categoryId: Number(categoryId)
        });

        const responseData = successResponse({
            message: "Expense added successfully",
            data: expense,
            statusCode:201
        });

        res.status(201).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const getAllExpenses = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        
        if(!userId) {
            throw new AppError(
                'User ID must be present',
                500
            )
        };

        // Get all Expense for the user
        const allExpenses = await getAllExpense({
            userId
        });

        const responseData = successResponse({
            message: "Expense retrieved successfully",
            data: allExpenses,
            statusCode: 200
        });

        return res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const getExpenseById = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { expenseId } =  req.params;
        
        if (!expenseId || Number.isNaN(Number(expenseId))) {
            throw new AppError(
                "ExpenseId must be a valid Number",
                400,
                ["ExpenseId is required and must be a valid number"]
            )
        }

        const expense = await findExpenseById({ expenseId, userId});

        if (!expense) {
            throw new AppError(
                "Expense not found",
                404,
                ["Expense not found"]
            )
        }

        const responseData = successResponse({
            message: "Expense retrieved successfully",
            data: expense,
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const deleteExpense = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { expenseId } = req.params;

        if (!expenseId || Number.isNaN(Number(expenseId))) {
            throw new AppError(
                "ExpenseId must be a valid number",
                400,
                ["ExpenseId is required and must be a valid number"]
            )
        }

        // Delete the expense record from the Database
        const responseDta = await deleteExpenseById({ expenseId, userId });

        const responseData = successResponse({
            message: "Expense deleted successfully",
            data: responseDta,
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const downloadExpenseExcelFormat = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                "User ID must be present",
                500
            )
        }

        // Get all expenses for the user to export
        const expenses = await getAllExpenseForExport({ userId });

        // Create a new workbook and worksheet 
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Expenses");

        // Define columns for the worksheet
        worksheet.columns = [
            { header: "Source", key: "source", width: 30 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Category", key: "category", width: 20 },
            { header: "Date", key: "date", width: 20 },
            { header: "Notes", key: "notes", width: 30 },
            { header: "Created At", key: "createdAt", width: 30 }
        ]

        // Style the header row
        worksheet.getRow(1).font = { bold: true };

        // Add expense data to the worksheet
        expenses.forEach((expense) => {
            worksheet.addRow({
                source: expense.source,
                amount: expense.amount,
                category: expense.category,
                date: expense.date,
                notes: expense.notes,
                createdAt: expense.createdAt
            });
        });

        // Set the response headers for file download
        res.setHeader(
            "Content-Type",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
            "Content-Disposition",
            "attachment; filename=incomes.xlsx"
        );

        // Write the workbook to the response
        await workbook.xlsx.write(res);

        res.end();
    } catch (error) {
        next(error);
    }
}