# VanityPhoneGenerator

This git commit contains a file tree and dependencies required for deployment via [Amplify CLI](https://docs.amplify.aws/cli/).

To view the source code for the main function, click [here](/amplify/backend/function/VanityGeneratorFunction/src/).

# Requirements
- Node.js
- Amplify CLI
- DynamoDB

# How to Use
1. Inside Amplify CLI, run `Amplify Push` in the root folder (where this ReadMe is located).
2. Create a new Amazon Connect Instance and open it in your browser. Under "Contact Flows", load the default entry contact flow. In the upper righthand corner, click the down arrow, then select "import flow" and choose `VANITYGENERATOR-ContactFlow` from within this folder.
3. Click on the `Invoke AWS Lambda function` block in the Contact Flow and make sure that the `VanityGeneratorFunction-dev` is selected.
4. Create a new phone number for your Amazon Connect instance.
5. Call your number, and find out any possbile vanity phone numbers which can be made from your phone number.

# Deployment
There is a working version of this program deployed at `(228) 447-3583`.