import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client with current region
// Dùng // thay vì # để comment
const client = new DynamoDBClient({}); // SDK sẽ tự động lấy thông tin AWS_REGION từ môi trường chạy của Lambda.

export const docClient = DynamoDBDocumentClient.from(client); // giúp bạn làm việc với JavaScript Object thuần túy

// Nếu bạn muốn bỏ qua các giá trị undefined, hãy dùng đoạn code dưới đây (đã sửa dấu comment)
/*
export const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
        removeUndefinedValues: true, 
    },
});
*/

// Environment variable for DynamoDB table name
export const TABLE_NAME = process.env.TABLE_NAME;
