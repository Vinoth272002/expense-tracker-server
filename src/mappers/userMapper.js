/**
 * User DTO Mapper
 * Maps raw DB rows (snake_case) to camelCase User objects
 */

export const mapOne = (row) => {
    if (!row) return null;

    return {
        userId: row.id,
        fullName: row.full_name,
        email: row.email,
        ...(row.password !== undefined && { password: row.password }),
        profilePicURL: row.profile_pic_url,
        createdAt: row.created_at
    };
};

export const mapMany = (rows) => {
    if (!rows || !Array.isArray(rows)) return [];

    return rows.map(mapOne);
};
