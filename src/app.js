import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import errorHandler from './middleware/errorHandler.js';
import authRoutes from './routes/authRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import incomeRoutes from './routes/incomeRoutes.js';
import expenseRoutes from './routes/expenseRoutes.js';
import categoryRoutes from './routes/categoriesRoutes.js';

dotenv.config();

const app = express();

// Middleware to handle CORS
app.use(
    cors({
        origin: process.env.CLIENT_URL || "*",
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ["Content-Type", "Authorization"]
    })
);

app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api", uploadRoutes);
app.use('/api/incomes', incomeRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/categories", categoryRoutes);

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use(errorHandler);

export default app;