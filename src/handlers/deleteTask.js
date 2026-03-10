import { taskService } from "../services/taskService.js";
import { success, serverError, notFound } from "../utils/response.js";

export const handler = async (event) => {
    try {
        const id = event.pathParameters?.id;
        if (!id) return clientError("Task ID là bắt buộc.");

        await taskService.removeTask(id);
        return success({ message: `Đã xóa thành công công việc ${id}` });
    } catch (error) {
        if (error.message.includes("Không tìm thấy")) return notFound(error.message);
        return serverError(error);
    }
};
