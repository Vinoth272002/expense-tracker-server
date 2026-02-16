import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import AppError from "../utils/AppError.js";
import { successResponse } from "../utils/response.js";

const router = express.Router();

router.post("/upload-file", upload.single("image"), (req, res) => {
    if (!req.file) {
        return new AppError('No file uploaded', 400, ["Image file is required"]);
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    const responseData = successResponse({
        message: "Image uploaded successfully",
        data: {
            fileUrl
        },
        statusCode: 200
    })
    res.status(200).json(responseData);
})

export default router;