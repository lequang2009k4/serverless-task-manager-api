export const sendResponse = (statusCode, data) => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // Hỗ trợ CORS cho Frontend
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        body: JSON.stringify(data),
    };
};

export const success = (data) => sendResponse(200, data);
export const created = (data) => sendResponse(201, data);
export const clientError = (message) => sendResponse(400, { message });
export const notFound = (message) => sendResponse(404, { message });
export const serverError = (error) => sendResponse(500, { 
    message: "Internal Server Error", 
    details: error.message 
});
