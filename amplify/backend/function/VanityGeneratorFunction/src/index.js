const AWS = require('aws-sdk');

const {calculateVanityNumbers} = require('./calculateVanityNumbers')
const DynamoHandler = require('./dynamo.js');

exports.handler = async (event, context) => {
  const start = Date.now();
  //get caller's phoneNumber from event parameters
  const phoneNumber = event.Details.Parameters.CustomerNumber;

  const vanityNumbers = calculateVanityNumbers(phoneNumber)

  //write to DB
  const DB = new DynamoHandler()
  const newTable = await DB.createNewTable()
  const newEntry = await DB.createNewEntry(phoneNumber, vanityNumbers)

  const newEntryParams = {
    TableName: 'VanityPhoneNumbers-dev',
    Item: {
      "phoneNumber": phoneNumber,
      "VanityNumbers": vanityNumbers
    }
  }

  const checkNewEntry = await DB.getEntry(newEntryParams)
  console.log(vanityNumbers)

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

