import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../config/password.js';
import { createUser, findUserByEmail, findUserById } from '../models/User.js';
import { successResponse }  from '../utils/response.js';
import AppError from '../utils/AppError.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// Register User
export const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password, profilePicUrl } = req.body;
        
        const errors = [];
        if (!fullName) errors.push("Full name is required");
        if (!email) errors.push("Email is required");
        if (!password) errors.push("Password is required");

        if (errors.length > 0) {
            throw new AppError(
                "Missing required  fields",
                400,
                errors
            )
        }

        const hashedPassword = await hashPassword(password);
        const user = await createUser({
            fullName,
            email,
            password: hashedPassword,
            profilePicUrl
        });
    
        const responseData = successResponse({
            message: "User registered successfully",
            data: user,
            token: generateToken(user.id),
            statusCode: 201
        });

        return res.status(201).json(responseData);
    } catch (error) {
        if (error.code === "23505") {
            error = new AppError(
                "validation error",
                409,
                ["Email already exists"]
            );
        }

        next(error);
    }
};

// Login User
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const errors = [];
        if (!email) errors.push("Email is required");
        if (!password) errors.push("Password is required");

        if (errors.length > 0) {
            throw new AppError(
                "Missing required  fields",
                400,
                errors
            )
        }

        const user = await findUserByEmail(email);

        if (!comparePassword(password, user.password)) {
            throw new AppError(
                "Invalid credentials",
                400,
                ["Invalid email or password"]
            )
        }
        

        if (!user) {
            return next(
                new AppError("User not found", 404, ["User does not exist"])
            );
        }

        const responseData = successResponse({
            message: "User login successfully",
            data: user,
            token: generateToken(user.id),
            statusCode: 201
        });

        return res.status(201).json(responseData);
    } catch (error) {
        next(error);
    }
};

// Get User Informations
export const getUserInfo = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const user = await findUserById(userId);

        if (!user) {
            return next(
                new AppError("User not found", 404, ["User does not exist"])
            );
        }

        const responseData = successResponse({
            message: "User fetched successfully",
            data: user,
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};