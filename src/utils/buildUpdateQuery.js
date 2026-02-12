import AppError from "./AppError.js";

// Map of camelCase field names to their snake_case DB column equivalents
const FIELD_COLUMN_MAP = {
    categoryName: "category_name",
    userId: "user_id",
    categoryId: "category_id",
    profilePicUrl: "profile_pic_url",
    fullName: "full_name",
    createdAt: "created_at",
    updatedAt: "updated_at"
};

export const buildUpdateQuery = ({ table, allowedFields, data, conditions }) => {
    const updates = [];
    const values = [];
    let index = 1;

    for (const field of allowedFields) {
        if (data[field] !== undefined) {
            // Convert camelCase field to snake_case column name if mapping exists
            const columnName = FIELD_COLUMN_MAP[field] || field;
            updates.push(`${columnName} = $${index}`);
            values.push(data[field]);
            index++;
        }
    }

    if (updates.length === 0) {
        throw new AppError(
            "No valid fields provided for update",
            400,
            ["No valid fields provided for update"]
        )
    }

    const whereClauses = [];

    for (const key in conditions) {
        whereClauses.push(`${key} = $${index}`);
        values.push(conditions[key]);
        index++;
    }

    const query = `
        UPDATE ${table}
        SET ${updates.join(', ')},
        updated_at = NOW()
        WHERE ${whereClauses.join(" AND ")}
        RETURNING *
    `;

    return { query, values };
}