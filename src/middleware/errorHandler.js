const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    
    const responseData = {
        success: false,
        message: err.message || "Internal server error",
        errorCode: statusCode,
        data: null,
        erros: err.errors?.length > 0 ? err.errors : [err.message || "Somthing went worng"]
    };

    res.status(statusCode).json(responseData);
};

export default errorHandler;
