const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    const responseData = {
        success: false,
        message: err.message || "Internal server error",
        errorCode: statusCode,
        data: null,
        errors: err.errors?.length > 0 ? err.errors : [err.message || "Something went wrong"]
    };

    res.status(statusCode).json(responseData);
};

export default errorHandler;
