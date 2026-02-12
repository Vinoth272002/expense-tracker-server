import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../config/password.js";
import * as userRepository from "../repositories/userRepository.js";
import * as userMapper from "../mappers/userMapper.js";
import AppError from "../utils/AppError.js";

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

export const register = async ({ fullName, email, password, profilePicUrl }) => {
    const hashedPassword = await hashPassword(password);

    const rawUser = await userRepository.createUser({
        fullName,
        email,
        password: hashedPassword,
        profilePicUrl
    });

    const user = userMapper.mapOne(rawUser);
    const token = generateToken(user.userId);

    return { user, token };
};

export const login = async ({ email, password }) => {
    const rawUser = await userRepository.findUserByEmail(email);

    if (!rawUser) {
        throw new AppError("User not found", 404, ["User does not exist"]);
    }

    const isPasswordValid = await comparePassword(password, rawUser.password);

    if (!isPasswordValid) {
        throw new AppError(
            "Invalid credentials",
            400,
            ["Invalid email or password"]
        );
    }

    const user = userMapper.mapOne(rawUser);
    delete user.password;

    const token = generateToken(user.userId);

    return { user, token };
};

export const getLoggedInUser = async (userId) => {
    const rawUser = await userRepository.findUserById(userId);

    if (!rawUser) {
        throw new AppError("User not found", 404, ["User does not exist"]);
    }

    return userMapper.mapOne(rawUser);
};
