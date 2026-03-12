import { taskService } from "../services/taskService.js";
import { success, serverError, notFound, clientError } from "../utils/response.js";

/**
 * Lambda handler to delete a specific task by its ID.
 * Integrated with Structured Logging & Request Context.
 * @param {Object} event - Contains request metadata and path parameters.
 * @param {Object} context - The Lambda context object for runtime information.
 */
export const handler = async (event, context) => {
    // 1. Initialize logContext (Correlation ID for tracing)
    const logContext = {
        awsRequestId: context.awsRequestId,
        path: event.path,
        httpMethod: event.httpMethod
    };

    try {
        // Extract the unique task ID from the URL path parameters
        const id = event.pathParameters?.id;

        // 2. Structured Log (DEBUG): Record the delete attempt
        console.debug(JSON.stringify({
            level: "DEBUG",
            timestamp: new Date().toISOString(),
            requestId: logContext.awsRequestId,
            message: "Attempting to delete task",
            taskId: id
        }));

        // Validation: Ensure the ID is provided
        if (!id) {
            return clientError("Task ID is required.", logContext);
        }

        // 3. Business Logic: Request service layer to delete the task
        await taskService.removeTask(id);

        // Return a 200 OK and automatically log at INFO level via response.js
        return success({ 
            message: `Task ${id} has been successfully deleted.` 
        }, logContext);

    } catch (error) {
        /**
         * 4. Error Handling
         * If the service layer indicates the item doesn't exist, return 404 (WARN level)
         */
        if (error.message.includes("Not found") ) {
            return notFound(error.message, logContext);
        }

        /**
         * 5. Unexpected System Errors
         * serverError will log the full Stack Trace as FATAL in CloudWatch
         */
        return serverError(error, logContext);
    }
};
