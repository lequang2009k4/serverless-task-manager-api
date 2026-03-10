export class Task {
    /**
     * @param {Object} data - Dữ liệu thô để khởi tạo Task
     * @param {string} data.id - ID duy nhất (thường là UUID)
     * @param {string} data.title - Tiêu đề công việc
     * @param {string} [data.createdAt] - Thời gian tạo
     */
    constructor({ id, title, status = 'pending', createdAt } = {}) { //Thêm = {} vào cuối tham số để tránh crash.
        this.id = id;
        this.title = title;
        this.status = status;
        this.createdAt = createdAt || new Date().toISOString();
    }

    // Phương thức kiểm tra dữ liệu hợp lệ cơ bản bên trong Model

    // Phương thức hỗ trợ chuyển đổi dữ liệu để lưu vào DynamoDB nếu cần

}
