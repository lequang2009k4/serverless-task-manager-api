import { taskService } from "../services/taskService.js";
import { created, clientError, serverError } from "../utils/response.js";
import { validator } from "../utils/validator.js";

export const handler = async (event) => {
    try {
        if (!event.body) return clientError("Dữ liệu đầu vào không được để trống.");
        
        const data = JSON.parse(event.body);
        
        // 1. Validate: Chỉ check tiêu đề không được để trống
        const check = validator.validateCreateTask(data);
        if (!check.isValid) return clientError(check.errors[0]);

        // 2. Gọi Service xử lý
        const result = await taskService.createNewTask(data);
        
        return created(result);
    } catch (error) {
        console.error("Error creating task:", error);
        return serverError(error);
    }
};
