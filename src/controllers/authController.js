import jwt from 'jsonwebtoken';
import { comparePassword, hashPassword } from '../config/password.js';
import { createUser, findUserByEmail, findUserById } from '../models/User.js';
import { successResponse }  from '../utils/response.js';
import AppError from '../utils/AppError.js';
import isEmail from 'validator/lib/isEmail.js';

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

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
                errors.push("Invalid email format")
            }
        }

        if (!password) {
            errors.push("Password is required");
        } else if (password.length < 8) {
            errors.push("Password must be at least 8 characters long");
        }

        if (errors.length > 0) {
            throw new AppError(
                "Missing required  fields",
                400,
                errors
            )
        }

        // Hash the password before storing it in the database
        const hashedPassword = await hashPassword(password);

        // Create the user record in the database
        const user = await createUser({
            fullName: fullName.trim(),
            email,
            password: hashedPassword,
            profilePicUrl
        });
    
        const responseData = successResponse({
            message: "User registered successfully",
            data: user,
            token: generateToken(user.userId),
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
export const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const errors = [];
        if (!email || !email.trim()) errors.push("Email is required");
        if (!password) errors.push("Password is required");

        if (errors.length > 0) {
            throw new AppError(
                "Missing required  fields",
                400,
                errors
            )
        }
       
        // Find the user by email from the database
        const user = await findUserByEmail(email);

        if (!user) {
            throw new AppError("User not found", 404, ["User does not exist"]);
        }

        // Compare the provided password with the hashed password stored in the database using bcrypt, if the password is does not match, return an error response
        const isPasswordValid = await comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new AppError(
                "Invalid credentials",
                400,
                ["Invalid email or password"]
            )
        }

        delete user.password;

        const responseData = successResponse({
            message: "User login successfully",
            data: user,
            token: generateToken(user.userId),
            statusCode: 200
        });

        return res.status(200).json(responseData);
    } catch (error) {
        next(error);
    }
};

// Get LoggedIn User Informations
export const getLoggedInUser = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            throw new AppError(
                'User ID must be present',
                500,
                ['User ID is missing in the request']
            )
        };

        // Find the user by ID from the database
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