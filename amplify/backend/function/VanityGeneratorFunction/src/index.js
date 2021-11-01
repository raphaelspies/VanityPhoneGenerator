const AWS = require('aws-sdk');

const {calculateVanityNumbers} = require('./calculateVanityNumbers')
const {dynamoHandler} = require('./dynamodb.js');

const URL = 'http://localhost:8000'
AWS.config.update({
  region: "us-west-2",
  endpoint: URL,
});
const dynamodb = new AWS.DynamoDB();
const docClient = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {
  const start = Date.now();
  //get caller's phoneNumber from event parameters
  const phoneNumber = event.Details.Parameters.CustomerNumber;

  const vanityNumbers = calculateVanityNumbers(phoneNumber)

  //write to DB
  const createdTable = await createTable()
  // console.log("createtable output: ", createdTable)

  const response = await buildResponseObject(vanityNumbers, phoneNumber)

  const stop = Date.now()
  console.log(`Time taken to execute = ${(stop - start)/1000} seconds`)
  return response;
};


//store result as an object
const buildResponseObject = (inputArray, phoneNumber) => {
  const responseObj = new Object();
  responseObj.CustomerNumber = phoneNumber;
  if (!inputArray || !inputArray[0]) {
    responseObj.VanityNumbers = "No valid vanity numbers"
  } else {
    let stringArray = ""
    for (let i = 0; i < inputArray.length; i++) {
      stringArray += (inputArray[i])
      if (i != inputArray.length - 1) {
        stringArray += ", "
      }
    }
    responseObj.VanityNumbers = stringArray//JSON.stringify(resultArray);
  }
  return responseObj
}

const createTable = async function (phoneNumber, vanityNumbers) {
  // should be create table IF NOT EXISTS
  const createTableParams = {
    TableName: 'VanityPhoneNumbers',
    KeySchema: [
      { AttributeName: "phoneNumber", KeyType: "HASH" }, //Partition key
      { AttributeName: "VanityNumbers", KeyType: "RANGE" }, //Sort key
    ],
    AttributeDefinitions: [
      { AttributeName: "phoneNumber", AttributeType: "S" },
      { AttributeName: "VanityNumbers", AttributeType: "List" },
    ],
  };

  try {
    const createTable = await dynamodb.createTable(createTableParams)
    // console.log(createTable)
  } catch (err) {
    console.error(err)
  }

  const newEntryParams = {
    TableName: 'VanityPhoneNumbers',
    Item: {
      "phoneNumber": phoneNumber,
      "VanityNumbers": vanityNumbers
    }
  }

  try {
    const putResponse = await docClient.put(newEntryParams)
    // console.log(putResponse);
  } catch (err) {
    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
  }
}