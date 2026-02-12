import pool from "../db/index.js";

export const createCategory = async ({ userId, categoryName, icon }) => {
    const query = `INSERT INTO categories
        (user_id, category_name, icon)
        VALUES($1, $2, $3)
        RETURNING
        category_id AS "categoryId",
        user_id AS "userId",
        category_name AS "categoryName",
        icon,
        created_at AS "createdAt"
    `;

    const result = await pool.query(query, [userId, categoryName, icon]);

    return result.rows[0];
}