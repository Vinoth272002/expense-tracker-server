import pool from "../db/index.js";

export const createUser = async ({ fullName, email, password, profilePicUrl }) => {
    const result = await pool.query(
       `INSERT INTO users  (full_name, email, password, profile_pic_url) VALUES ($1, $2, $3, $4) RETURNING id, full_name, email, profile_pic_url, created_at`, [fullName, email, password, profilePicUrl]
    );

    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        "SELECT * FROM users WHERE email = $1", [email]
    );

    return result.rows[0];
}

export const findUserById  = async (id) => {
    const result = await pool.query(
        "SELECT id, full_name, email, profile_pic_url, created_at FROM users WHERE id = $1", [id]
    );

    return result.rows[0];
}