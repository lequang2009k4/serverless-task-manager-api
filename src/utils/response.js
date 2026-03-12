/**
 * Generic function to format the Lambda response and execute Structured Logging.
 * @param {number} statusCode - HTTP status code
 * @param {object} data - Data to be returned to the client
 * @param {object} context - Lambda context to extract requestId and request info
 */
export const sendResponse = (statusCode, data, context = {}) => {
    // 1. Classify Log Level based on HTTP status code
    let logLevel = "INFO";
    if (statusCode >= 400 && statusCode < 500) logLevel = "WARN";
    if (statusCode >= 500) logLevel = "ERROR";

    // 2. Structured Logging (JSON format)
    // Ensures no sensitive info is logged, focusing on important Metadata
    const logEntry = {
        level: logLevel,
        timestamp: new Date().toISOString(),
        requestId: context.awsRequestId || "N/A", // Context: Correlation ID
        method: context.httpMethod || "N/A",
        path: context.path || "N/A",
        statusCode,
        // Log response size instead of full content to save storage/cost
        responseSize: JSON.stringify(data).length 
    };

    // Execute logging to CloudWatch
    if (logLevel === "ERROR") {
        console.error(JSON.stringify(logEntry));
    } else if (logLevel === "WARN") {
        console.warn(JSON.stringify(logEntry));
    } else {
        console.info(JSON.stringify(logEntry));
    }

    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*", // CORS support
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        body: JSON.stringify(data),
    };
};

/**
 * Helper for 200 OK responses
 */
export const success = (data, context) => sendResponse(200, data, context);

/**
 * Helper for 201 Created responses
 */
export const created = (data, context) => sendResponse(201, data, context);

/**
 * Helper for 400 Bad Request responses
 */
export const clientError = (message, context) => sendResponse(400, { message }, context);

/**
 * Helper for 404 Not Found responses
 */
export const notFound = (message, context) => sendResponse(404, { message }, context);

/**
 * Helper for 500 Internal Server Error responses
 * Adheres to: Log detailed error (Stack trace) internally, but keep client response generic for security.
 */
export const serverError = (error, context) => {
    console.error(JSON.stringify({
        level: "FATAL",
        requestId: context.awsRequestId || "N/A",
        message: error.message,
        stack: error.stack // Critical context for debugging
    }));

    return sendResponse(500, { 
        message: "Internal Server Error" 
    }, context);
};
