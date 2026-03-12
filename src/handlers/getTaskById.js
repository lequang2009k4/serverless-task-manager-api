import { taskService } from "../services/taskService.js";
import { success, notFound, serverError, clientError } from "../utils/response.js";

/**
 * Lambda handler to retrieve detailed information for a specific task.
 * Integrated with Structured Logging & Request Context.
 * @param {Object} event - Event object containing path parameters.
 * @param {Object} context - The Lambda context object for runtime information.
 * @returns {Object} - Response with task details or an error message.
 */
export const handler = async (event, context) => {
    // 1. Initialize logContext (Correlation ID for tracing)
    const logContext = {
        awsRequestId: context.awsRequestId,
        path: event.path,
        httpMethod: event.httpMethod
    };

    try {
        // Extract the unique task identifier from path parameters
        const id = event.pathParameters?.id;

        // 2. Structured Log (DEBUG): Record the fetch attempt
        console.debug(JSON.stringify({
            level: "DEBUG",
            timestamp: new Date().toISOString(),
            requestId: logContext.awsRequestId,
            message: "Fetching task details",
            taskId: id
        }));

        // Validation: Ensure a Task ID is provided
        if (!id) {
            return clientError("Task ID is required.", logContext);
        }

        // 3. Business Logic: Fetch specific task from the service layer
        const task = await taskService.getTaskDetails(id);
        
        // 4. Success Response
        // Automatically logs at INFO level via response.js
        return success(task, logContext);

    } catch (error) {
        /**
         * 5. Error Handling
         * If the service layer indicates the item doesn't exist, return 404 (WARN level)
         * English-only check for professional consistency.
         */
        if (error.message.includes("Not found")) {
            return notFound(error.message, logContext);
        }

        /**
         * 6. Unexpected System Errors
         * serverError will log the full Stack Trace as FATAL in CloudWatch
         */
        return serverError(error, logContext);
    }
};
