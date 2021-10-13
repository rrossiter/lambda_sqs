'use strict';

const factory = require('./factory');
const SQS = require('aws-sdk/clients/sqs');
//const AWS = require('aws-sdk');

const config = {
  apiVersion: '2012-11-05',
  region: process.env.SQS_REGION,
  //...(process.env.STAGE === 'local' ? { endpoint: new AWS.Endpoint('http://localhost:4566') } : {}),
  httpOptions: {
    timeout: 30000,
  },
}

const sqs = new SQS(config);

module.exports = config => ({
  repositorySqs: factory({
    sqs,
    config,
  }),
});
