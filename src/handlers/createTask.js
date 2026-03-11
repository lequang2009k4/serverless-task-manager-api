import { taskService } from "../services/taskService.js";
import { created, clientError, serverError } from "../utils/response.js";
import { validator } from "../utils/validator.js";

/**
 * Lambda/Controller handler to create a new task.
 * @param {Object} event - The event object from the provider (e.g., AWS API Gateway).
 * @returns {Object} - Formatted HTTP response.
 */
export const handler = async (event) => {
    try {
        // Check if the request body exists
        if (!event.body) {
            return clientError("Input data cannot be empty.");
        }

        // Parse the incoming JSON string into an object
        let data;
        try {
            data = JSON.parse(event.body);
        } catch (parseError) {
            return clientError("Invalid JSON format.");
        }

        // 1. Validation: Ensure required fields (e.g., title) are present
        const validationResult = validator.validateCreateTask(data);
        if (!validationResult.isValid) {
            // Return the first validation error message found
            return clientError(validationResult.errors);
        }

        // 2. Business Logic: Call the service layer to interact with the database
        const newTask = await taskService.createNewTask(data);

        // Return a 201 Created response with the result data
        return created(newTask);

    } catch (error) {
        // Log the error for internal debugging
        console.error("Error creating task:", error);

        // Return a 500 Internal Server Error response
        return serverError("An unexpected error occurred while creating the task.");
    }
};
