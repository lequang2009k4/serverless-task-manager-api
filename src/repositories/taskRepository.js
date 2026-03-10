import { 
    PutCommand, 
    GetCommand, 
    ScanCommand, 
    DeleteCommand, 
    UpdateCommand 
} from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../config/dynamoClient.js";
import { Task } from "../models/taskModel.js";

export const taskRepository = {
    // Lưu một task mới hoặc ghi đè task cũ
    async save(task) {
        const command = new PutCommand({
            TableName: TABLE_NAME,
            Item: task,
        });
        await docClient.send(command);
        return task;
    },

    // Lấy một task theo ID
    async getById(id) {
        const command = new GetCommand({
            TableName: TABLE_NAME,
            Key: { id },
        });
        const { Item } = await docClient.send(command);
        // Trả về một instance của Task Model để đảm bảo tính nhất quán
        return Item ? new Task(Item) : null;
    },

    // Lấy tất cả task (Scan)
    async getAll() {
        const command = new ScanCommand({
            TableName: TABLE_NAME,
        });
        const { Items } = await docClient.send(command);
        return (Items || []).map(item => new Task(item));
    },

    // Xóa task theo ID
    async delete(id) {
        const command = new DeleteCommand({
            TableName: TABLE_NAME,
            Key: { id },
        });
        return await docClient.send(command);
    }

};
