import { taskService } from "../services/taskService.js";
import { success, serverError } from "../utils/response.js";

/**
 * Lambda handler to retrieve all tasks from the database.
 * @returns {Object} - Success response with the list of tasks or an error.
 */
export const handler = async (event) => {
    try {
        // Business Logic: Fetch the complete list of tasks from the service layer
        const tasks = await taskService.listAllTasks();

        // Return a 200 OK success response containing the array of tasks
        return success(tasks);

    } catch (error) {
        // Detailed logging to help identify server-side issues (e.g., DB connection failure)
        console.error("Error retrieving tasks list:", error);

        // Return a 500 Internal Server Error for any system failures
        return serverError("An unexpected error occurred while fetching the tasks.");
    }
};
