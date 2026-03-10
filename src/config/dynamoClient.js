import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client with current region
const client = new DynamoDBClient({}); #SDK sẽ tự động lấy thông tin AWS_REGION từ môi trường chạy của Lambda.
export const docClient = DynamoDBDocumentClient.from(client); # giúp bạn làm việc với JavaScript Object thuần túy thay vì kiểu dữ liệu phức tạp của DynamoDB
#export const docClient = DynamoDBDocumentClient.from(client, {
#    marshallOptions: {
#        removeUndefinedValues: true, // Tự động bỏ qua các field bị undefined thay vì báo lỗi
#    },
#});
// Environment variable for DynamoDB table name
export const TABLE_NAME = process.env.TABLE_NAME;
