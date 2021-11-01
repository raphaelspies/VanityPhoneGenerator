const {handler} = require('../index');
const eventNoVanity = require('./event-noVanity');
const eventHasVanity = require('./event-hasVanity');
const eventInvalidNo = require('./event-invalidNo')


test('Valid phone number with no vanity numbers', async () => {
  const expectedResult = {
    "CustomerNumber": "+16073424400",
    "VanityNumbers": "No valid vanity numbers"
  };
  const result = await handler(eventNoVanity);
  expect(result).toStrictEqual(expectedResult);
});


test('Valid phone number with vanity numbers', async () => {
  const expectedResult = {
    "CustomerNumber": "+18003569377",
    "VanityNumbers": "1-800-flowers, 1-800-3-lowers"
  };
  const result = await handler(eventHasVanity);
  expect(result).toStrictEqual(expectedResult);
})

test('Invalid phone number fails', async () => {
  expect.assertions(1) // make sure one assertion is called
  try {
    await handler(eventInvalidNo);
  } catch (e) {
    expect(e).toEqual(new Error('Phone number is invalid')
    )
  }

  // expect(async () => {
  //   await handler(eventInvalidNo);
  // }).toThrow(new Error())


  // expect(async () => {
  //   const result =  await handler(eventInvalidNo);
  //   return result;
  // }).rejects.toThrow(new Error())


  // toThrow(Error("Phone number is invalid"))
  // .catch(err => {
  //   expect(err).toEqual(new Error())
  // })
})