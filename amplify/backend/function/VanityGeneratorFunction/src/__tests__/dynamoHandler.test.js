// const {DocumentClient} = require('aws-sdk/clients/dynamodb');
const AWS = require('aws-sdk');
const {handler} = require('../index');
const {dynamoHandler} = require('../dynamo.js');

const isTest = process.env.JEST_WORKER_ID;
const config = {
  convertEmptyValues: true,
  ...(isTest && {
    endpoint: 'localhost:8000',
    sslEnabled: false,
    region: 'local-env',
  }),
};

const dynamodb = new AWS.DynamoDB();
const ddb = new AWS.DynamoDB.DocumentClient(config);

xit('should insert item into table', async () => {

  const filesTable = {
    TableName: `files`,
    KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
    AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
    ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
  }

  await dynamodb.createTable(filesTable)

  await dynamoHandler()

  await ddb.put({TableName: 'files', Item: {id: '1', hello: 'world'}})
    .promise();

  const {Item} = await ddb.get({TableName: 'files', Key: {id: '1'}}).promise();

  expect(Item).toEqual({
    id: '1',
    hello: 'world',
  });

});