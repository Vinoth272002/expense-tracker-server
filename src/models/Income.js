import pool from "../db/index.js";

export const createIncome = async ({ userId, icon, source, amount, date }) => {
    const result = await pool.query(
        `INSERT INTO incomes (user_id, icon, source, amount, date) VALUES ($1, $2, $3, $4, $5) RETURNING *`, [userId, icon, source, amount, date]
    );

    return result.rows[0];
};

export const getAllIncomes = async ({ userId }) => {
    const result = await pool.query(
        `SELECT * FROM incomes WHERE user_id = $1`, [userId]
    );

    return result.rows;
};

export const deleteIncome = async ({ incomeId, userId }) => {
    const result = await pool.query(
        `DELETE FROM incomes WHERE id = $1 AND user_id = $2 RETURNING id`, [incomeId, userId]
    );

    return result.rows[0];
}