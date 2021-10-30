const isWord = require('is-word');
const englishWords = isWord('american-english');
const AwesomeNumber = require('awesome-phonenumber');

exports.handler = async (event, context) => {
  //timer for function runtime duration
  const start = Date.now();

  //get CustomerNumber parameter from input event
  const phoneNumber = event.Details.Parameters.CustomerNumber;
  const pn = new AwesomeNumber(phoneNumber, "US");

  //validate phone number
  if(!pn.isValid()) {
    throw new Error("Phone number is invalid")
  }
  //separate prefix (e.g., area code) from exchange code + line number
  const countryCode = pn.getCountryCode();
  const prefix = pn.getNumber('significant').slice(0,3)
  const relevantDigits = pn.getNumber('significant').slice(3);

  //invoke letterCombinations with a sliding window (min length: 4 chars)
  const vanityNumbers = slidingWindow(relevantDigits, letterCombinations)

  //build a response Object using the returned vanity numbers
  const responseObject = buildResponseObject(vanityNumbers, phoneNumber)

  //stop timer and return the response
  const stop = Date.now()
  console.log(`Time taken to execute = ${(stop - start)/1000} seconds`)
  return responseObject;
};

  //generate all possible permutations of letters
  const letterCombinations = (digits, unusedNums) => {

    let resultArray = [];

    if (digits.length === 0) {
      return []
    };

    const map = {
      "1": ["1"],
      "2": ["a", "b", "c"],
      "3": ["d", "e", "f"],
      "4": ["g", "h", "i"],
      "5": ["j", "k", "l"],
      "6": ["m", "n", "o"],
      "7": ["p", "q", "r", "s"],
      "8": ["t", "u", "v"],
      "9": ["w", "x", "y", "z"],
      "0": ["o"]
    };

    let stack = [];

    const dfs = (digits, index, stack) => {
      let currentLetters = map[digits[index]];

      for (let i = 0; i < currentLetters.length; i++) {
        stack.push(currentLetters[i]);
        //exit dfs once 5 valid permutations are found
        if (resultArray.length >= 5) {
          return resultArray;
        }
        //once a full valid combo has been created
        if (index === digits.length - 1) {
          let currentWord = stack.join('');
          //check if it's a real word
          if (englishWords.check(currentWord)) {
            // adds the unused nums and '-' before the word, then pushes result to array
            (unusedNums === 0) ?
              resultArray.push(countryCode + "-" + prefix + "-" + currentWord) :
              resultArray.push(countryCode + "-" + prefix + "-" + relevantDigits.slice(0, unusedNums) + '-' + currentWord);
          }
        } else {
          dfs(digits, index + 1, stack);
        };
        stack.pop();
      };
    };

    dfs(digits.split(''), 0, stack)
    return resultArray;
  };

const slidingWindow = (input, callback) => {
  let allResults = [];
  for (let i = 0; i < input.length - 4; i++) {
    allResults = allResults.concat(callback(input.slice(i), i))
  }
  return allResults;
}

const buildResponseObject = (inputArray, originalPhoneNumber) => {
  const responseObj = new Object();
  responseObj.CustomerNumber = originalPhoneNumber;
  if (!inputArray || !inputArray[0]) {
    responseObj.VanityNumbers = "No valid vanity numbers";
  } else {
    let stringArray = "";
    for (let i = 0; i < inputArray.length; i++) {
      stringArray += (inputArray[i]);
      if (i != inputArray.length - 1) {
        stringArray += ", ";
      }
    }
    responseObj.VanityNumbers = stringArray;
  }
  return responseObj;
}