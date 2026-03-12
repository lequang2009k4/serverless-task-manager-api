import { taskService } from "../services/taskService.js";
import { created, clientError, serverError } from "../utils/response.js";
import { validator } from "../utils/validator.js";

/**
 * Lambda handler to create a new task.
 * Integrated with Structured Logging & Request Context.
 * @param {Object} event - The event object from AWS API Gateway.
 * @param {Object} context - The Lambda context object for runtime information.
 */
export const handler = async (event, context) => {
    // 1. Initialize logContext (The "red thread" for log tracing)
    const logContext = {
        awsRequestId: context.awsRequestId,
        path: event.path,
        httpMethod: event.httpMethod
    };

    try {
        // Check if the request body exists
        if (!event.body) {
            return clientError("Input data cannot be empty.", logContext);
        }

        let data;
        try {
            data = JSON.parse(event.body);
        } catch (parseError) {
            return clientError("Invalid JSON format.", logContext);
        }

        // 2. Structured Log (DEBUG): Record the parsed input
        // Principle: "No Sensitive Info" - sanitize any PII before logging if necessary
        console.debug(JSON.stringify({
            level: "DEBUG",
            timestamp: new Date().toISOString(),
            requestId: logContext.awsRequestId,
            message: "Incoming create task request",
            payload: data 
        }));

        // 3. Validation
        const validationResult = validator.validateCreateTask(data);
        if (!validationResult.isValid) {
            // This will be logged as WARN via response.js
            return clientError(validationResult.errors, logContext);
        }

        // 4. Business Logic
        const newTask = await taskService.createNewTask(data);

        // Return 201 Created and automatically log at INFO level
        return created(newTask, logContext);

    } catch (error) {
        /**
         * 5. System Error Handling
         * serverError will automatically log at FATAL level with Stack Trace in CloudWatch
         * while returning a generic message to the Client for security.
         */
        return serverError(error, logContext);
    }
};
