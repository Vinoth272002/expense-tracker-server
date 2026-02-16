import jwt from 'jsonwebtoken';
import AppError  from "../utils/AppError.js";

export const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return next(
            new AppError("Unauthorized", 401, ["Token missing"])
        )
    }
    
    const token = authHeader.split(" ")[1];
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            id: decoded.id
        }
        
        next();
    } catch (error) {
        next(
            new AppError("Unauthorized", 401, ["Invalid or expired token"])
        );
    }
}