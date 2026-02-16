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
        date: new Date(row.date).getTime(),
        notes: row.notes,
        createdAt: new Date(row.created_at).getTime()
    };
};

export const mapMany = (rows) => {
    if (!rows || !Array.isArray(rows)) return [];

    return rows.map(mapOne);
};
