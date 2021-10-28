const checkWord = require('check-word');
const words = checkWord('en');

const AwesomeNumber = require('awesome-phonenumber');
const parsePhoneNumber = require('libphonenumber-js');

exports.handler = async (event, context) => {

  //read event, then select phone number from key1 and region code from key2
  const pn = new AwesomeNumber(event.key1, event.key2);
  //validate phone number
  if(!pn.isValid()) {
    throw new Error("Phone number is invalid")
  }
  //separate prefix (e.g., area code) from exchange code + line number
  const countryCode = pn.getCountryCode();
  const prefix = pn.getNumber('significant').slice(0,3)
  const phoneNumber = pn.getNumber('significant').slice(3);



  // //generate all possible permutations of letters
  const letterCombinations = (digits, unusedNums) => {

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

    let resultArray = [];
    let stack = [];

    const dfs = (digits, index, stack) => {
      let currentLetters = map[digits[index]];

      for (let i = 0; i < currentLetters.length; i++) {
        stack.push(currentLetters[i]);

        if (index === digits.length - 1) {
          //check if it's a real word
          let currentWord = stack.join('')
          if (words.check(currentWord)) {
            console.log(digits)
            resultArray.push(countryCode + "-" + prefix + "-" + phoneNumber.slice(0, unusedNums) + '-' + currentWord);
          }
        } else {
          dfs(digits, index + 1, stack);
        };
        stack.pop();
      };
    };

    dfs(digits.split(''), 0, stack)
    console.log(resultArray)
    return resultArray;
  };

  //invoke letterCombinations with a sliding window (min length: 4 chars)
  const permutations = (input) => {
    let first3Results = [];
    for (let i = 0; i < input.length - 4; i++) {
      if (first3Results.length < 3) {
        first3Results = first3Results.concat(letterCombinations(input.slice(i), i))
      } else {
        return first3Results;
      }
    }
    return first3Results;
  }
    // console.log(`permutations: ${JSON.stringify(permutations)}`);
    // const validPermutations = lookForWords(permutations)
    const result = permutations(phoneNumber)
    // console.log(`Length of result: ${result.length}`);
    return result;
  };