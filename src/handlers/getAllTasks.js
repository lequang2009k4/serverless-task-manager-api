import { taskService } from "../services/taskService.js";
import { success, serverError } from "../utils/response.js";

/**
 * Lambda handler to retrieve all tasks from the database.
 * Integrated with Structured Logging & Request Context.
 * @param {Object} event - The event object from AWS API Gateway.
 * @param {Object} context - The Lambda context object for runtime information.
 * @returns {Object} - Formatted HTTP response.
 */
export const handler = async (event, context) => {
    // 1. Initialize logContext (Correlation ID for tracing)
    const logContext = {
        awsRequestId: context.awsRequestId,
        path: event.path,
        httpMethod: event.httpMethod
    };

    try {
        // 2. Structured Log (DEBUG): Record the fetch attempt
        // Useful for checking how often the full list is requested
        console.debug(JSON.stringify({
            level: "DEBUG",
            timestamp: new Date().toISOString(),
            requestId: logContext.awsRequestId,
            message: "Fetching all tasks from database"
        }));

        // 3. Business Logic: Fetch the complete list of tasks
        const tasks = await taskService.listAllTasks();

        // 4. Success Response
        // Automatically logs at INFO level via response.js
        return success(tasks, logContext);

    } catch (error) {
        /**
         * 5. Unexpected System Errors
         * serverError will log the full Stack Trace as FATAL in CloudWatch
         * using the logContext to link the error to this specific request.
         */
        return serverError(error, logContext);
    }
};
