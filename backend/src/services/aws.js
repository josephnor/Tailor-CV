const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient } = require('@aws-sdk/lib-dynamodb');
const { S3Client } = require('@aws-sdk/client-s3');

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);
const s3Client = new S3Client({ region: 'us-east-1' });

module.exports = {
    docClient,
    s3Client
};
