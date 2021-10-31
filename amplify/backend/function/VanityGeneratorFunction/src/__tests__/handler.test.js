const {handler} = require('../index');
const eventNoVanity = require('./event-noVanity');
const eventHasVanity = require('./event-hasVanity');


test('Valid phone number with no vanity numbers', async () => {
  const expectedResult = {
    "CustomerNumber": "+16073424400",
    "VanityNumbers": "No valid vanity numbers"
  };
  console.log(JSON.stringify(handler))
  const result = await handler(eventNoVanity);
  expect(result).toStrictEqual(expectedResult);
});


test('Valid phone number with vanity numbers', async () => {
  const expectedResult = {
    "CustomerNumber": "+18003569377",
    "VanityNumbers": "1-800-flowers, 1-800-3-lowers"
  };
  console.log(JSON.stringify(handler))
  const result = await handler(eventHasVanity);
  expect(result).toStrictEqual(expectedResult);
})