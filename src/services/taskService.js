import { v4 as uuidv4 } from "uuid";
import { taskRepository } from "../repositories/taskRepository.js";
import { Task } from "../models/taskModel.js";

export const taskService = {
    // Logic tạo mới một công việc
    async createNewTask(data) {
        // 1. Tạo thực thể Task mới (Model lo phần cấu hình mặc định)
        const newTask = new Task({
            id: uuidv4(),
            title: data.title,
        });
        // 2. Kiểm tra tính hợp lệ (Validation logic)

        // 3. Gọi Repository để lưu vào Database
        return await taskRepository.save(newTask);
    },

    // Logic lấy chi tiết công việc
    async getTaskDetails(id) {
        if (!id) throw new Error("Task ID là bắt buộc.");

        const task = await taskRepository.getById(id);
        if (!task) {
            throw new Error(`Không tìm thấy công việc với ID: ${id}`);
        }
        return task;
    },

    // Logic lấy toàn bộ danh sách
    async listAllTasks() {
        return await taskRepository.getAll();
    },

    // Logic xóa công việc
    async removeTask(id) {
        // Có thể thêm logic kiểm tra quyền sở hữu ở đây nếu cần
        await this.getTaskDetails(id); // Kiểm tra xem task có tồn tại không trước khi xóa
        return await taskRepository.delete(id);
    }
};
