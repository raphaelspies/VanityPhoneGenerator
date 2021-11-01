module.exports = {
  tables: [
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