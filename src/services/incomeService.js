import * as incomeRepository from "../repositories/incomeRepository.js";
import * as incomeMapper from "../mappers/incomeMapper.js";
import { buildUpdateQuery } from "../utils/buildUpdateQuery.js";
import AppError from "../utils/AppError.js";

export const create = async ({ userId, icon, source, amount, date, notes }) => {
    const rawIncome = await incomeRepository.createIncome({
        userId, icon, source, amount, date, notes
    });

    return incomeMapper.mapOne(rawIncome);
};

export const getAll = async (userId) => {
    const rawIncomes = await incomeRepository.getAllIncomes({ userId });

    return incomeMapper.mapMany(rawIncomes);
};

export const getById = async (incomeId, userId) => {
    const rawIncome = await incomeRepository.findIncomeById({ incomeId, userId });

    if (!rawIncome) {
        throw new AppError("Income not found", 404, ["Income not found"]);
    }

    return incomeMapper.mapOne(rawIncome);
};

export const update = async (incomeId, userId, data) => {
    const { query, values } = buildUpdateQuery({
        table: "incomes",
        allowedFields: ["amount", "icon", "source", "notes", "date"],
        data,
        conditions: {
            id: incomeId,
            user_id: userId
        }
    });

    const rawIncome = await incomeRepository.updateIncomeById({ query, values });

    if (!rawIncome) {
        throw new AppError("Income not found", 404);
    }

    return incomeMapper.mapOne(rawIncome);
};

export const remove = async (incomeId, userId) => {
    const rawIncome = await incomeRepository.deleteIncomeById({ incomeId, userId });

    return incomeMapper.mapOne(rawIncome);
};

export const exportAll = async (userId) => {
    const rawIncomes = await incomeRepository.getAllIncomesForExport({ userId });

    return incomeMapper.mapMany(rawIncomes);
};
