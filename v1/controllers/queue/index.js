'use strict';

const config = require('../../../config');
const { repositorySqs } = require('../../repository/sqs')({ config });
const adapters = require('../../adapters')({ repositorySqs, config });

const queueWrapper = () => {
  const send = async (event) => {

    let response = {};

    try {
      response = await adapters.send(event);
      
      checkFailures(response, event.headers);
      //const { processingStatus: { failed } } = response;
      //if (failed && Array.isArray(failed) && failed.length > 0) {
        //await adapters.sendDLQ({ headers: event.headers, body: failed });
      //}

    } catch (error) {
      console.log(error);
      return { statusCode: 200, body: JSON.stringify(error) };
    }

    const result = {
      statusCode: 200,
      body: `Recebemos ${response.receivedAmount.length} mensagens e destas processamos um total de ${response.processingStatus.successful.length} com sucesso! Quantidade de mensagens com erro ${response.processingStatus.failed.length}`
    };
    console.log(JSON.stringify(result));
    return result;
  };

  const checkFailures = (data, headers) => {
    const { processingStatus: { failed } } = data;
    if (failed && Array.isArray(failed) && failed.length > 0) {
      adapters.sendDLQ({ headers, body: failed });
    }
  };

  return { send };
};

module.exports = queueWrapper;
