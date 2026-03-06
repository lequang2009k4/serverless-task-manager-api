import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, TABLE_NAME, sendResponse } from './utils/ddbClient.js';

/**
 * Lambda handler for retrieving all tasks (GET /tasks)
 */
export const handler = async () => {
    try {
        // Execute ScanCommand to retrieve all items from the table
        const data = await docClient.send(new ScanCommand({ 
            TableName: TABLE_NAME 
        }));

        // Log success for internal monitoring
        console.log("Successfully retrieved tasks count:", data.Items?.length || 0);

        // Return 200 OK with the array of items
        return sendResponse(200, {
            count: data.Items?.length || 0,
            tasks: data.Items || []
        });

    } catch (error) {
        // Log the exact error to CloudWatch for debugging
        console.error("Fetch All Error:", error);

        // Return a 500 Internal Server Error response
        return sendResponse(500, { 
            message: "Failed to retrieve tasks", 
            error: error.message 
        });
    }
};
