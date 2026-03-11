import { taskService } from "../services/taskService.js";
import { success, serverError, notFound, clientError } from "../utils/response.js";

/**
 * Lambda handler to delete a specific task by its ID.
 * @param {Object} event - Contains request metadata and path parameters.
 * @returns {Object} - Response indicating success or failure.
 */
export const handler = async (event) => {
    try {
        // Extract the unique task ID from the URL path parameters
        const id = event.pathParameters?.id;

        // Validation: Ensure the ID is provided before proceeding
        if (!id) {
            return clientError("Task ID is required.");
        }

        // Business Logic: Request the service layer to delete the task from the database
        await taskService.removeTask(id);

        // Return a 200 OK success response with a confirmation message
        return success({ message: `Task ${id} has been successfully deleted.` });

    } catch (error) {
        // Error Handling: If the service throws a "Not Found" error, return 404
        // (Assuming the service uses the keyword "Not found" in its exception)
        if (error.message.includes("Not found") || error.message.includes("Không tìm thấy")) {
            return notFound(error.message);
        }

        // Log the full error for server-side debugging
        console.error("Error deleting task:", error);

        // Return a 500 Internal Server Error for any other unexpected issues
        return serverError("An error occurred while attempting to delete the task.");
    }
};
