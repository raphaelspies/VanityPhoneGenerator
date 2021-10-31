const {handler} = require('../index');
const defaultEvent = require('../event');

const expectedResult = {
  "CustomerNumber": "16073424419",
  "VanityNumbers": "No valid vanity numbers"
}

test('correct output from main function', async () => {
  console.log(JSON.stringify(handler))
  const result = await handler(defaultEvent);
  expect(result).toStrictEqual(expectedResult);
})