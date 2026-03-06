import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME, sendResponse } from './utils/ddbClient.js';

/**
 * Lambda handler for retrieving a single task by its ID (GET /tasks/{id})
 */
export const handler = async (event) => {
    try {
        // Extracting 'id' from the URL path parameters
        const id = event.pathParameters?.id;

        // If ID is missing, return a Bad Request status
        if (!id) {
            return sendResponse(400, { message: "Task ID is required" });
        }

        // Fetching the item from DynamoDB using the primary key (id)
        const data = await docClient.send(new GetCommand({ 
            TableName: TABLE_NAME, 
            Key: { id } 
        }));

        // If the item does not exist in the table, return 404 Not Found
        if (!data.Item) {
            return sendResponse(404, { 
                message: "Task not found", 
                id: id 
            });
        }

        // Successfully retrieved the item
        return sendResponse(200, data.Item);

    } catch (error) {
        // Log the error for debugging in CloudWatch
        console.error("Retrieve Task Error:", error);

        // Return a 500 Internal Server Error response
        return sendResponse(500, { 
            message: "Internal server error while fetching task", 
            error: error.message 
        });
    }
};
