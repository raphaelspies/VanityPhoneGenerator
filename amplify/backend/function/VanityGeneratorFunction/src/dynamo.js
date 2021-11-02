const AWS = require('aws-sdk');

const URL = 'http://localhost:8000'

module.exports.dynamoHandler = async (phoneNumber, vanityNumbers) => {

  AWS.config.update({
    region: "us-west-2",
    endpoint: URL,
  });

  const dynamodb = new AWS.DynamoDB();
  const docClient = new AWS.DynamoDB.DocumentClient();

  //check if table exists

  try {
    const createTable = async () => {
      const createTableParams = {
        TableName: 'VanityPhoneNumbers-dev',
        KeySchema: [
          { AttributeName: "phoneNumber", KeyType: "HASH" }, //Partition key
          { AttributeName: "VanityNumbers", KeyType: "RANGE" }, //Sort key
        ],
        AttributeDefinitions: [
          { AttributeName: "phoneNumber", AttributeType: "S" },
          { AttributeName: "VanityNumbers", AttributeType: "List" },
        ],
      };
      // should be create table IF NOT EXISTS
      await dynamodb.createTable(createTableParams)
    }
    createTable();
  } catch (err) {
    console.log(err)
  }

  // const docClient = dynamodb.DocumentClient();

  const newEntryParams = {
    TableName: 'VanityPhoneNumbers-dev',
    Item: {
      "phoneNumber": phoneNumber,
      "VanityNumbers": vanityNumbers
    }
  }

  try {
    const result = await docClient.put(newEntryParams)
    console.log("Added item ");
  } catch (err) {
    console.error(err);
  }

  return;
}
