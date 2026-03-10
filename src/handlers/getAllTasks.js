import { taskService } from "../services/taskService.js";
import { success, serverError } from "../utils/response.js";

export const handler = async (event) => {
    try {
        const tasks = await taskService.listAllTasks();
        return success(tasks);
    } catch (error) {
        console.error("Error getting all tasks:", error);
        return serverError(error);
    }
};
