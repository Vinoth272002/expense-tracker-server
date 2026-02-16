import pool from "../db/index.js";
import AppError from "../utils/AppError.js";

export const createExpense = async ({ userId, icon, source, amount, date, notes, categoryId }) => {
    const query = `INSERT INTO expenses
        (user_id, icon, source, amount, date, notes, category_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
    `;

    const result = await pool.query(query, [userId, icon, source, amount, date, notes, categoryId]);

    return result.rows[0];
};

export const getAllExpenses = async ({ userId }) => {
    const query = `SELECT * FROM expenses
        WHERE user_id = $1
        ORDER BY date DESC
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};

export const findExpenseById = async ({ expenseId, userId }) => {
    const query = `SELECT * FROM expenses
        WHERE id = $1 AND user_id = $2
    `;

    const result = await pool.query(query, [expenseId, userId]);

    return result.rows[0];
};

export const updateExpenseById = async ({ query, values }) => {
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const deleteExpenseById = async ({ expenseId, userId }) => {
    const query = `DELETE FROM expenses
        WHERE id = $1 AND user_id = $2
        RETURNING id
    `;

    const result = await pool.query(query, [expenseId, userId]);

    if (result.rowCount === 0) {
        throw new AppError(
            "Expense not found",
            404,
            ["Expense not found"]
        );
    }

    return result.rows[0];
};

export const getAllExpensesForExport = async ({ userId }) => {
    const query = `SELECT source, amount, date, notes, created_at
        FROM expenses
        WHERE user_id = $1
        ORDER BY date DESC
    `;

    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
        throw new AppError(
            "No expenses records found",
            404,
            ["No expenses records found for export"]
        );
    }

    return result.rows;
};
