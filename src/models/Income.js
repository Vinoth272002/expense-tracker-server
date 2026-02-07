import pool from "../db/index.js";
import AppError from "../utils/AppError.js";

export const createIncome = async ({ userId, icon, source, amount, date, notes }) => {
    const query = `INSERT INTO incomes
        (user_id, icon, source, amount, date, notes)
        VALUES
        ($1, $2, $3, $4, $5, $6)
        RETURNING
        id AS "incomeId",
        user_id AS "userId",
        icon,
        source,
        amount,
        date,
        notes
    `;
    
    const result = await pool.query(query, [userId, icon, source, amount, date, notes]);

    return result.rows[0];
};

export const getAllIncomes = async ({ userId }) => {
    const query = `SELECT
        id AS "incomeId",
        user_id AS "userId",
        icon,
        source,
        amount,
        date,
        notes
        FROM incomes WHERE user_id = $1
        ORDER BY date DESC
    `;
    
    const result = await pool.query(query, [userId]);

    return result.rows;
};

export const deleteIncomeById = async ({ incomeId, userId }) => {
    const query = `DELETE FROM incomes
        WHERE id = $1
        AND user_id = $2
        RETURNING id AS "incomeId"
    `;
    
    const result = await pool.query(query, [incomeId, userId]);
    
    if (result.rowCount === 0) {
        throw new AppError(
            "Income not found or not authorized to delete",
            404,
            ["Income not found or you are not authorized to delete this income"]
        )
    }

    return result.rows[0];
};

export const getAllIncomesForExport = async({ userId }) => {
    const query = `SELECT
        source,
        amount,
        date,
        notes,
        created_at AS "createdAt"
        FROM incomes
        WHERE user_id = $1
        ORDER BY date DESC
    `;

    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
        throw new AppError(
            "No incomes records found",
            404,
            ["No income records found for export"]
        )
    }

    return result.rows;
}