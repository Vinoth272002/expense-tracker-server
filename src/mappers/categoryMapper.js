/**
 * Category DTO Mapper
 * Maps raw DB rows (snake_case) to camelCase Category objects
 */

export const mapOne = (row) => {
    if (!row) return null;

    return {
        categoryId: row.category_id,
        userId: row.user_id,
        categoryName: row.category_name,
        icon: row.icon,
        createdAt: row.created_at
    };
};

export const mapMany = (rows) => {
    if (!rows || !Array.isArray(rows)) return [];

    return rows.map(mapOne);
};
