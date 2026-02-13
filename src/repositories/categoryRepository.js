import pool from "../db/index.js";

export const createCategory = async ({ userId, categoryName, icon }) => {
    const query = `INSERT INTO categories
        (user_id, category_name, icon)
        VALUES ($1, $2, $3)
        RETURNING *
    `;

    const result = await pool.query(query, [userId, categoryName, icon]);

    return result.rows[0];
};

export const findCategoryById = async ({ userId, categoryId }) => {
    const query = `SELECT * FROM categories
        WHERE user_id = $1 AND category_id = $2
    `;

    const result = await pool.query(query, [userId, categoryId]);

    return result.rows[0];
};

export const getAllCategories = async ({ userId }) => {    
    const query = `SELECT * FROM categories
        WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    return result.rows;
};

export const updateCategoryById = async ({ query, values }) => {
    const result = await pool.query(query, values);

    return result.rows[0];
};

export const deleteCategoryById = async ({ categoryId, userId }) => {
    const query = `DELETE FROM categories
        WHERE category_id = $1 AND user_id = $2
        RETURNING category_id
    `;

    const result = await pool.query(query, [categoryId, userId]);

    if (result.rowCount === 0) {
        throw new AppError(
            "Category not found",
            404,
            ["Category not found"]
        );
    }
    return result.rows[0];
}
