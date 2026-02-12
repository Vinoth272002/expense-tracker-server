import pool from "../db/index.js";

export const createUser = async ({ fullName, email, password, profilePicUrl }) => {
    const query = `INSERT INTO users (full_name, email, password, profile_pic_url)
        VALUES ($1, $2, $3, $4)
        RETURNING *
    `;

    const result = await pool.query(query, [fullName, email, password, profilePicUrl]);

    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const query = `SELECT * FROM users WHERE email = $1`;

    const result = await pool.query(query, [email]);

    return result.rows[0];
};

export const findUserById = async (id) => {
    const query = `SELECT id, full_name, email, profile_pic_url, created_at
        FROM users WHERE id = $1
    `;

    const result = await pool.query(query, [id]);

    return result.rows[0];
};
