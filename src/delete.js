import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME, sendResponse } from './utils/ddbClient.js';

/**
 * Lambda handler for deleting a specific task (DELETE /tasks/{id})
 */
export const handler = async (event) => {
    try {
        // Extracting the 'id' from path parameters
        const id = event.pathParameters?.id;

        // Validation for missing ID
        if (!id) {
            return sendResponse(400, { message: "Task ID is required" });
        }

        // Execution of the DeleteCommand to remove the item from DynamoDB
        await docClient.send(new DeleteCommand({ 
            TableName: TABLE_NAME, 
            Key: { id } 
        }));

        // Return a successful 200 OK response
        return sendResponse(200, { 
            message: "Task deleted successfully", 
            taskId: id 
        });

    } catch (error) {
        // Log the error for CloudWatch debugging
        console.error("Deletion Error:", error);

        // Return a 500 Internal Server Error response
        return sendResponse(500, { 
            message: "Failed to delete task", 
            error: error.message 
        });
    }
};
