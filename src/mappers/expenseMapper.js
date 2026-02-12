/**
 * Expense DTO Mapper
 * Maps raw DB rows (snake_case) to camelCase Expense objects
 */

export const mapOne = (row) => {
    if (!row) return null;

    return {
        expenseId: row.id,
        userId: row.user_id,
        categoryId: row.category_id,
        icon: row.icon,
        source: row.source,
        amount: row.amount,
        date: row.date,
        notes: row.notes,
        createdAt: row.created_at
    };
};

export const mapMany = (rows) => {
    if (!rows || !Array.isArray(rows)) return [];

    return rows.map(mapOne);
};
