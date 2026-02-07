import { createIncome, deleteIncomeById, getAllIncomes, getAllIncomesForExport } from "../models/Income.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/response.js";
import ExcelJS from "exceljs";

export const addIncome = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { icon, source, amount, date, notes } = req.body;

        // Validate the request data
        const errors = [];
        if (!source || !source.trim()) errors.push("Source is required");

        if (amount === undefined || amount === null) {
            errors.push("Amount is required");
        } else if (isNaN(amount)) {
            errors.push("Amount must be a number");
        } else if (Number(amount) <= 0) {
            errors.push("Amount must be greater than 0")
        }
        
        // Check the date if provided, otherwise set it to the current date
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

        // Create the income record in the database
        const income = await createIncome({
            userId,
            icon,
            source: source.trim(),
            amount: Number(amount),
            date,
            notes: notes.trim()
        });

        // Format the response data
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
                'User ID must be present',
                500
            )
        };

        // Get all incomes for the user
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

export const deleteIncome = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { incomeId } = req.params;

        if (!incomeId || isNaN(incomeId)) {
            throw new AppError(
                "IncomeId must be a valid number",
                400,
                ["IncomeId is required and must be a valid number"]
            )
        }

        // Delete the income record from the Database
        const responseDta = await deleteIncomeById({ incomeId, userId });

        const responseData = successResponse({
            message: "Income deleted successfully",
            data: responseDta,
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const downloadIncomeExcelFormat = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                "User ID must be present",
                500
            )
        }

        // Get all incomes for the user to export
        const incomes = await getAllIncomesForExport({ userId });

        // Create a new workbook and worksheet 
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Incomes");

        // Define columns for the worksheet
        worksheet.columns = [
            { header: "Source", key: "source", width: 30 },
            { header: "Amount", key: "amount", width: 15 },
            { header: "Date", key: "date", width: 20 },
            { header: "Notes", key: "notes", width: 30 },
            { header: "Created At", key: "createdAt", width: 30 }
        ]

        // Style the header row
        worksheet.getRow(1).font = { bold: true };

        // Add income data to the worksheet
        incomes.forEach((income) => {
            worksheet.addRow({
                source: income.source,
                amount: income.amount,
                date: income.date,
                notes: income.notes,
                createdAt: income.createdAt
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
};