const AWS = require('aws-sdk');

module.exports = class DynamoHandler  {
  constructor () {
    this.dynamodb = new AWS.DynamoDB();

    AWS.config.update({
      region: "us-west-2",
    });
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
    const newEntryParams = {
      TableName: 'VanityPhoneNumbers-dev',
      Item: {
        "phoneNumber": phoneNumber,
        "VanityNumbers": vanityNumbers
      }
    }

    try {
      await this.dynamodb.putItem(newEntryParams);
      console.log("Added item ");
    } catch (err) {
      console.error(err);
    }
  }

  async getEntry(newEntryParams) {
    const result = await this.dynamodb.getItem(newEntryParams)
    console.log(result)
    return result;
  }

}
