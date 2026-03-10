import { taskService } from "../services/taskService.js";
import { success, notFound, serverError, clientError } from "../utils/response.js";

export const handler = async (event) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) return clientError("Task ID là bắt buộc.");

        const task = await taskService.getTaskDetails(id);
        return success(task);
    } catch (error) {
        if (error.message.includes("Không tìm thấy")) {
            return notFound(error.message);
        }
        return serverError(error);
    }
};
