import { 
    PutCommand, 
    GetCommand, 
    ScanCommand, 
    DeleteCommand 
} from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME } from "../config/dynamoClient.js";
import { Task } from "../models/taskModel.js";

/**
 * Task Repository
 * Handles direct database operations with structured error logging.
 */
export const taskRepository = {
    // Save a new task
    async save(task) {
        try {
            const command = new PutCommand({
                TableName: TABLE_NAME,
                Item: task,
            });
            await docClient.send(command);
            return task;
        } catch (error) {
            console.error(JSON.stringify({
                level: "ERROR",
                timestamp: new Date().toISOString(),
                component: "TaskRepository",
                operation: "save",
                taskId: task.id,
                message: error.message
            }));
            throw error; // Re-throw so Service/Handler can react
        }
    },

    // Retrieve a single task by ID
    async getById(id) {
        try {
            const command = new GetCommand({
                TableName: TABLE_NAME,
                Key: { id },
            });
            const { Item } = await docClient.send(command);
            return Item ? new Task(Item) : null;
        } catch (error) {
            console.error(JSON.stringify({
                level: "ERROR",
                timestamp: new Date().toISOString(),
                component: "TaskRepository",
                operation: "getById",
                taskId: id,
                message: error.message
            }));
            throw error;
        }
    },

    // Retrieve all tasks (Scan)
    async getAll() {
        try {
            const command = new ScanCommand({
                TableName: TABLE_NAME,
            });
            const { Items } = await docClient.send(command);
            return (Items || []).map(item => new Task(item));
        } catch (error) {
            console.error(JSON.stringify({
                level: "ERROR",
                timestamp: new Date().toISOString(),
                component: "TaskRepository",
                operation: "getAll",
                message: error.message
            }));
            throw error;
        }
    },

    // Delete a task by ID
    async delete(id) {
        try {
            const command = new DeleteCommand({
                TableName: TABLE_NAME,
                Key: { id },
            });
            const result = await docClient.send(command);
            return result;
        } catch (error) {
            console.error(JSON.stringify({
                level: "ERROR",
                timestamp: new Date().toISOString(),
                component: "TaskRepository",
                operation: "delete",
                taskId: id,
                message: error.message
            }));
            throw error;
        }
    }
};
