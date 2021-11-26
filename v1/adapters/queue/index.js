'use strict';

const Joi = require('joi');
const { queueSchema } = require('../../schemas');

const queueWrapper = ({
  repositorySqs,
  config,
}) => {

  const isFailed = queueMessage => queueMessage.map(item => item.Failed).flat();
  const joinErrors = (item, invalidEvents) => item.failed.push(...invalidEvents);
  const isSuccessful = queueMessage => queueMessage.map(item => item.Successful).flat();
  const processingStatus = (data) => ({ successful: isSuccessful(data), failed: isFailed(data) });
  const parse = body => typeof body === 'string' ? JSON.parse(body) : JSON.parse(JSON.stringify(body));
  const makeObject = (event, headers, queueUrl) => ({ group: eventsBatch(event, 10), headers, queueUrl: queueUrl });
  const eventsBatch = (event, limitRecords) => new Array(Math.ceil(event.length / limitRecords)).fill().map(_ => event.splice(0, limitRecords));

  const validateEvents = event => {
    const validEvents = [];
    const invalidEvents = [];
    const eventsReceived = [...parse(event.body)];

    eventsReceived.forEach(item => {
      const schemaQueue = Joi.object(queueSchema.request.queue);
      const { error } = schemaQueue.validate(item);

      if (!error) validEvents.push(item);
      else invalidEvents.push({ item, error });
    });

    return { validEvents, invalidEvents };
  };

  const send = async (event) => {
    let response = {};
    console.log(' adapter.send --> ' + JSON.stringify(event));
    try {
      response.receivedAmount = [...parse(event.body)];
      const { validEvents, invalidEvents } = validateEvents(event);
      const data = makeObject(validEvents, event.headers, config.queueUrl);

      joinErrors(
        response.processingStatus = processingStatus(await repositorySqs.sendMessageBatch(data)),
        invalidEvents
      );
      console.log(JSON.stringify(response));
    } catch (error) {
      throw error;
    }
    return response;
  };

  const sendDLQ = async (event) => {
    let response = {};
    console.log(' adapter.sendDLQ --> ' + JSON.stringify(event));
    try {
      const data = makeObject(event.body, event.headers, config.queueUrlDlq);
      response.processingStatus = processingStatus(await repositorySqs.sendMessageBatch(data));
      console.log(JSON.stringify(response));
    } catch (error) {
      throw error;
    }
    return response;
  };

  return { send, sendDLQ };
};

module.exports = queueWrapper;
