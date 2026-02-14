import * as authService from "../services/authService.js";
import { successResponse } from "../utils/response.js";
import AppError from "../utils/AppError.js";
import isEmail from "validator/lib/isEmail.js";

// Register User
export const registerUser = async (req, res, next) => {
    try {
        const { fullName, email, password, profilePicUrl } = req.body;

        const errors = [];

        if (!fullName || !fullName.trim()) errors.push("Full name is required");

        if (!email || !email.trim()) {
            errors.push("Email is required");
        } else {
            email = email.toLowerCase().trim();
            if (!isEmail(email)) {
                errors.push("Invalid email format");
            }
        }

        if (!password) {
            errors.push("Password is required");
        } else if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }

        if (errors.length > 0) {
            throw new AppError("Missing required fields", 400, errors);
        }

        const { user, accessToken, refreshToken } = await authService.register({
            fullName: fullName.trim(),
            email,
            password,
            profilePicUrl
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const responseData = successResponse({
            message: "User registered successfully",
            data: user,
            accessToken,
            statusCode: 201
        });

        return res.status(201).json(responseData);
    } catch (error) {
        if (error.code === "23505") {
            error = new AppError(
                "Validation error",
                409,
                ["Email already exists"]
            );
        }

        next(error);
    }
};

// Login User
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = [];
        if (!email || !email.trim()) errors.push("Email is required");
        if (!password) errors.push("Password is required");

        if (errors.length > 0) {
            throw new AppError("Missing required fields", 400, errors);
        }

        const { user, accessToken, refreshToken } = await authService.login({ email, password });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        const responseData = successResponse({
            message: "User login successfully",
            data: user,
            accessToken,
            statusCode: 200
        });

        return res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

// Get LoggedIn User Information
export const getLoggedInUser = async (req, res, next) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                "User ID must be present",
                500,
                ["User ID is missing in the request"]
            );
        }

        const user = await authService.getLoggedInUser(userId);

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

export const logoutUser = async (req, res, next) => {
    try {
        res.clearCookie('refreshToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        const responseData = successResponse({
            message: "User logged out successfully",
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

export const refreshToken = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppError("Refresh token missing", 401, ["Please login again"]);
        }

        const { accessToken, newRefreshToken } = await authService.refreshAccessToken(refreshToken);

        const responseData = successResponse({
            message: "Token refreshed successfully",
            accessToken,
            statusCode: 200
        });

        res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
}