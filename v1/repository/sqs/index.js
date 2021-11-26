'use strict';

const factory = require('./factory');
const AWS = require('aws-sdk');
//const AWS = require('aws-sdk');

const config = {
  apiVersion: '2012-11-05',
  region: process.env.SQS_REGION,
  //...(process.env.STAGE === 'local' ? { endpoint: new AWS.Endpoint('http://localhost:4566') } : {}),
  httpOptions: {
    timeout: 30000,
  },
}

const sqs = new AWS.SQS(config);

module.exports = config => ({
  repositorySqs: factory({
    sqs,
    config,
  }),
});
