import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client with current region
const client = new DynamoDBClient({});
export const docClient = DynamoDBDocumentClient.from(client);

// Environment variable for DynamoDB table name
export const TABLE_NAME = process.env.TABLE_NAME;

/**
 * Helper to standardize API Gateway responses
 */
export const sendResponse = (statusCode, body) => {
    return {
        statusCode,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*" // CORS support
        },
        body: JSON.stringify(body)
    };
};
