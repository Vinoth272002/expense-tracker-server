import jwt from "jsonwebtoken";
import { hashPassword, comparePassword } from "../config/password.js";
import * as userRepository from "../repositories/userRepository.js";
import * as userMapper from "../mappers/userMapper.js";
import AppError from "../utils/AppError.js";

const generateTokens = (id) => {
    const accessToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const refreshToken = jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    return { accessToken, refreshToken }
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
    const { accessToken, refreshToken } = generateTokens(user.userId);
    delete user.password;
    return { user, accessToken, refreshToken };
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

    const { accessToken, refreshToken } = generateTokens(user.userId);

    return { user, accessToken, refreshToken };
};

export const getLoggedInUser = async (userId) => {
    const rawUser = await userRepository.findUserById(userId);

    if (!rawUser) {
        throw new AppError("User not found", 404, ["User does not exist"]);
    }

    return userMapper.mapOne(rawUser);
};


export const refreshAccessToken = async (refreshToken) => {
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
        const user = await userRepository.findUserById(decoded.id);

        if (!user) {
            throw new AppError("User not found", 404, ["User does not exist"]);
        }

        const tokens = generateTokens(user.id);
        return { accessToken: tokens.accessToken, newRefreshToken: tokens.refreshToken };
    } catch (error) {
        throw new AppError("Invalid refresh token", 401, ["Invalid or expired refresh token"]);
    }
};

export const updateUserProfile = async (userId, { fullName, profilePicUrl }) => {
    const rawUser = await userRepository.updateUser(userId, { fullName, profilePicUrl });

    if (!rawUser) {
        throw new AppError("User not found", 404, ["User does not exist"]);
    }

    return userMapper.mapOne(rawUser);
};