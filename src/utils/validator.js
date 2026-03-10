export const validator = {
    validateCreateTask: (data) => {
        const errors = [];
        
        // Kiểm tra nếu không có title hoặc sau khi cắt khoảng trắng mà chuỗi rỗng
        if (!data.title || data.title.trim() === "") {
            errors.push("Title không được để trống.");
        }

        return {
            isValid: errors.length === 0,
            errors
        };
    }
};
