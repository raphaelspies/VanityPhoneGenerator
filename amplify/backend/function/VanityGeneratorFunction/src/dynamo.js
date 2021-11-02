const AWS = require('aws-sdk');

module.exports = class DynamoHandler  {
  constructor () {
    this.dynamodb = new AWS.DynamoDB();

    AWS.config.update({
      region: "us-west-2",
      endpoint: "http://dynamodb.us-west-2.amazonaws.com",
    });

    this.createNewTable();
  }


  // const dynamodb = new AWS.DynamoDB();
  // const docClient = new AWS.DynamoDB.DocumentClient();

  //check if table exists

  async createNewTable() {
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
        await this.dynamodb.createTable(createTableParams)
      }
      createTable();
    } catch (err) {
      console.log(err)
    }
  }

  // const docClient = dynamodb.DocumentClient();
  async createNewEntry(phoneNumber, vanityNumbers) {
    let newEntryParams = {
      "TableName": 'VanityPhoneNumbers-dev',
      "Item": {
        "phoneNumber": phoneNumber,
        "VanityNumbers": vanityNumbers,
      }
    }

    try {
      await this.dynamodb.putItem(newEntryParams);
      console.log("Added item ");
    } catch (err) {
      console.error(err);
    }
  }

  async getEntry(searchPhoneNumber) {
    let params = {
      "TableName": 'VanityPhoneNumbers-dev',
      "Key": {
        'phoneNumber': {S: searchPhoneNumber}
      }
    }

    const result = await this.dynamodb.getItem(params)
    // console.log(result)
    return result;
  }

}
