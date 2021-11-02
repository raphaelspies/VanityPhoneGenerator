module.exports = {
  tables: [
    {
      TableName: `files`,
      KeySchema: [{AttributeName: 'id', KeyType: 'HASH'}],
      AttributeDefinitions: [{AttributeName: 'id', AttributeType: 'S'}],
      ProvisionedThroughput: {ReadCapacityUnits: 1, WriteCapacityUnits: 1},
    },
    {
      TableName: 'VanityPhoneNumbers',
      KeySchema: [
        { AttributeName: "phoneNumber", KeyType: "HASH" }, //Partition key
        { AttributeName: "VanityNumbers", KeyType: "RANGE" }, //Sort key
      ],
      AttributeDefinitions: [
        { AttributeName: "phoneNumber", AttributeType: "S" },
        { AttributeName: "VanityNumbers", AttributeType: "List" },
      ],
    }
  ],
};