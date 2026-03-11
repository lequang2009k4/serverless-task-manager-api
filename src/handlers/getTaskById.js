import { taskService } from "../services/taskService.js";
import { success, notFound, serverError, clientError } from "../utils/response.js";

/**
 * Lambda handler to retrieve detailed information for a specific task.
 * @param {Object} event - Event object containing path parameters.
 * @returns {Object} - Response with task details or an error message.
 */
export const handler = async (event) => {
    try {
        // Extract the unique task identifier from path parameters
        const id = event.pathParameters?.id;

        // Validation: Ensure a Task ID is provided in the request URL
        if (!id) {
            return clientError("Task ID is required.");
        }

        // Business Logic: Fetch specific task information from the service layer
        const task = await taskService.getTaskDetails(id);
        
        // Return a 200 OK success response with the retrieved task object
        return success(task);

    } catch (error) {
        // Error Handling: Catch cases where the task does not exist in the database
        // Note: Check for both English and Vietnamese error triggers for compatibility
        if (error.message.includes("Not found") || error.message.includes("Không tìm thấy")) {
            return notFound(error.message);
        }

        // Log the error for internal system monitoring
        console.error(`Error retrieving details for task ${event.pathParameters?.id}:`, error);

        // Return a 500 Internal Server Error for generic failures
        return serverError("An unexpected error occurred while fetching task details.");
    }
};
