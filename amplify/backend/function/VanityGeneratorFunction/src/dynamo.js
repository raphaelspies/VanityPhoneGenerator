const AWS = require('aws-sdk');

const URL = 'http://localhost:8000'

module.exports.dynamoHandler = async (phoneNumber, vanityNumbers) => {

  AWS.config.update({
    region: "us-west-2",
    endpoint: URL,
  });

  const dynamodb = new AWS.DynamoDB();

  //check if table exists
  const checkIfExistsParams = {
    TableName: 'VanityPhoneNumbers'
  };

  dynamodb.describeTable(checkIfExistsParams, (err, data) => {
    if (err) {

      const createTable = () => {
        const createTableParams = {
          TableName: 'VanityPhoneNumbers',
          KeySchema: [
            { AttribueName: "phoneNumber", keyType: "HASH" }, //Partition key
            { AttributeName: "VanityNumbers", keyType: "RANGE" }, //Sort key
          ],
          AttributeDefinitions: [
            { AttribueName: "phoneNumber", AttributeType: "S" },
            { AttributeName: "VanityNumbers", AttributeType: "List" },
          ],
        };

        // should be create table IF NOT EXISTS
        dynamodb.createTable(createTableParams, (err, data) => {
          if (err) {
            console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
          } else {
            console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
          }
        });
      }

      createTable();

      console.log("error: table doesn't exist")
    } else {
      console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
    }
  })



  // const createTableParams = {
  //   TableName: 'VanityPhoneNumbers',
  //   KeySchema: [
  //     { AttribueName: "phoneNumber", keyType: "HASH" }, //Partition key
  //     { AttributeName: "VanityNumbers", keyType: "RANGE" }, //Sort key
  //   ],
  //   AttributeDefinitions: [
  //     { AttribueName: "phoneNumber", AttributeType: "S" },
  //     { AttributeName: "VanityNumbers", AttributeType: "List" },
  //   ],
  // };

  // should be create table IF NOT EXISTS
  // dynamodb.createTable(createTableParams, (err, data) => {
  //   if (err) {
  //     console.error("Unable to create table. Error JSON:", JSON.stringify(err, null, 2));
  //   } else {
  //     console.log("Created table. Table description JSON:", JSON.stringify(data, null, 2));
  //   }
  // });

  // const docClient = dynamodb.DocumentClient();

  // const newEntryParams = {
  //   TableName: 'VanityPhoneNumbers',
  //   Item: {
  //     "phoneNumber": phoneNumber,
  //     "VanityNumbers": VanityNumbers
  //   }
  // }

  // docClient.put(newEntryParams, (err, data) => {
  //   if (err) {
  //     console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  //   } else {
  //     console.log("Added item:", JSON.stringify(data, null, 2));
  //   }
  // })

  console.log("hello")
  return;
}
