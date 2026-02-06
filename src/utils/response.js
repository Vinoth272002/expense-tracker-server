export const successResponse = ({ message = "Success", data = null, statusCode = 200, ...other }) =>{
    return {
        success: true,
        message,
        statusCode,
        data,
        ...other
    };
};