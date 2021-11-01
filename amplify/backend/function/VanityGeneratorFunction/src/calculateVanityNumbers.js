const isWord = require('is-word');
const englishWords = isWord('american-english');
const AwesomeNumber = require('awesome-phonenumber');

module.exports.calculateVanityNumbers = (phoneNumber) => {
  const pn = new AwesomeNumber(phoneNumber, "US");

   //validate phone number
   if(!pn.isValid()) {
    throw new Error("Phone number is invalid")
  }
  //separate prefix (e.g., area code) from exchange code + line number
  const countryCode = pn.getCountryCode();
  const prefix = pn.getNumber('significant').slice(0,3)
  const relevantDigits = pn.getNumber('significant').slice(3);

  let resultArray = []; // held as closure to allow length to be regularly checked

  //invoke letterCombinations with a sliding window (min length: 4 chars)
  const slidingWindow = (input) => {
    for (let i = 0; i < input.length - 4; i++) {
      letterCombinations(input.slice(i), i)
    }
    return;
  }

  //generate all possible permutations of letters
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

    let stack = [];

    const dfs = (digits, index, stack) => {
      let currentLetters = map[digits[index]];

      for (let i = 0; i < currentLetters.length; i++) {
        stack.push(currentLetters[i]);
        //exit dfs once 5 valid permutations are found
        if (resultArray.length >= 5) {
          return;
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
    return;
  };

  //invoke function
  slidingWindow(relevantDigits);
  return resultArray;
}