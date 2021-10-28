# VanityPhoneGenerator

This git commit contains a file tree and dependencies required for deployment via [Amplify CLI](https://docs.amplify.aws/cli/).

To view the source code for the main function, click [here](/amplify/backend/function/VanityGeneratorFunction/src/). 

# Requirements
- Node.js
- Amplify CLI 

# How to Use
1. function input can be set by opening `event.json` and changing the value of `"key1"` to the desired input (in string format)
2. To mock the function on localhost: `amplify mock function VanityGeneratorFunction` (it is recommended to set the timeout beyond the default 10 seconds by adding `--timeout` + time in seconds)
