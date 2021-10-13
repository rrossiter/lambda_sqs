'use strict';

require('dotenv').config();

module.exports = {
  service: process.env.SERVICE,
  environment: process.env.STAGE,
  region: process.env.REGION,
  account: process.env.ACCOUNT_ID,
  limit: process.env.LIMIT,
  queueUrl: process.env.QUEUE_URL,
};
