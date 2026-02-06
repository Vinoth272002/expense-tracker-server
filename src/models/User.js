import pool from "../db/index.js";

export const createUser = async ({ fullName, email, password, profilePicUrl }) => {
    const result = await pool.query(
       `INSERT INTO users  (full_name, email, password, profile_pic_url) VALUES ($1, $2, $3, $4)
        RETURNING
        id AS "userId",
        full_name AS "fullName",
        email,
        profile_pic_url AS "profilePicURL",
        created_at AS "createdAt"
       `,
       [fullName, email, password, profilePicUrl]
    );

    return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT
        id AS "userId",
        full_name AS "fullName",
        email,
        password,
        profile_pic_url AS "profilePicURL",
        created_at AS "createdAt"
        FROM users WHERE email = $1`, [email]
    );

    return result.rows[0];
}

export const findUserById  = async (id) => {
    const result = await pool.query(
        `SELECT
        id AS "userId",
        full_name AS "fullName",
        email,
        profile_pic_url AS "profilePicURL",
        created_at AS "createdAt"
        FROM users WHERE id = $1 `, [id]
    );

    return result.rows[0];
}