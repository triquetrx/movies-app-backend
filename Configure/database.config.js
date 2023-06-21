const mongo = require("mongoose");
const { logger } = require("./logger.config");
const dynamoose = require('dynamoose');

// let mongoConnectUrl;
// if (process.env.ENV === "development") {
//   mongoConnectUrl = `${process.env.DB_URL}/muvi`;
// } else if (process.env.ENV === "test") {
//   mongoConnectUrl = `${process.env.DB_TEST_URL}`;
// }

const ddb = new dynamoose.aws.ddb.DynamoDB({
  "credentials": {
      "accessKeyId": env.AWS_ACCESS_KEY_ID,
      "secretAccessKey": env.AWS_SECRET_ACCESS_KEY
  },
  "region": AWS_REGION
});

dynamoose.aws.ddb.set(ddb);

// mongo.set("strictQuery", true);
// mongo
//   .connect(mongoConnectUrl)
//   .then(() =>
//     logger.info(
//       `Connected to the database successfully, URL: ${mongoConnectUrl}`
//     )
//   );

module.exports.dynamoose = dynamoose;
