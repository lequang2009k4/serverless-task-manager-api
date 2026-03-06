import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
import { docClient, TABLE_NAME, sendResponse } from "./utils/ddbClient.js";

/**
 * Lambda handler to create a new task in DynamoDB
 * Path: POST /tasks
 */
export const handler = async (event) => {
    try {
        // Parse the incoming JSON body
        const payload = JSON.parse(event.body || "{}");

        // Construct the new task item
        const newItem = {
            id: uuidv4(),
            title: payload.title || "Untitled",
            status: "pending",
            createdAt: new Date().toISOString()
        };

        // Execute the PutCommand to save the item
        await docClient.send(new PutCommand({ 
            TableName: TABLE_NAME, 
            Item: newItem 
        }));

        // Return success response with the created item
        return sendResponse(201, {
            message: "Task created successfully",
            data: newItem
        });
    } catch (error) {
        // Log the error for CloudWatch and return a 500 status
        console.error("Error creating task:", error);
        return sendResponse(500, { 
            message: "Failed to create task", 
            error: error.message 
        });
    }
};
