'use strict';

const Joi = require('joi');
const { queueSchema } = require('../../schemas');

const queueWrapper = ({
  repositorySqs,
  config,
}) => {

  const generateMessageGroup = (eventGroup, limit) => new Array(Math.ceil(eventGroup.length / limit)).fill().map(_ => eventGroup.splice(0, limit));

  const validateEvents = eventGroup => {
    return eventGroup.filter(message => {
      const schemaQueue = Joi.object(queueSchema.request.queue);
      const { error } = schemaQueue.validate(message);

      // const schemaHeader = Joi.object(queueSchema.request.header);
      // const { errorHeader } = schemaHeader.validate(event.headers);    

      if (!error) {
        return message;
      }
      else { console.log(JSON.stringify(error)); };
    })
  };

  const isSuccessful = queueMessage => queueMessage.map(item => item.Successful).flat();
  const isFailed = queueMessage => queueMessage.map(item => item.Failed).flat();
  const difference = (eventsReceived, eventsGroupHandled) => eventsReceived.filter(item => !eventsGroupHandled.includes(item));

  const send = async ({ body, headers }) => {

    let response = {};

    try {

      response.eventGroupReceived = JSON.parse(body);
      const eventGroup = generateMessageGroup(validateEvents(response.eventGroupReceived), config.limit);

      const event = {
        eventGroup,
        headers: headers,
        queueUrl: config.queueUrl,
      };

      try {
        const queueMessage = await repositorySqs.sendMessageBatch(event);

        response.processingStatus = {
          successful: isSuccessful(queueMessage),
          failed: isFailed(queueMessage),
        };

        const eventsRemovedFormattingError = difference(response.eventGroupReceived, eventGroup.flat());
        if (eventsRemovedFormattingError) response.processingStatus.failed.push(eventsRemovedFormattingError);

        console.log(JSON.stringify(response));

      } catch (error) {
        console.log(JSON.stringify(error));
        throw error;
      }
    } catch (error) {

      return {
        statusCode: 400,
        body: `Erro ao processar eventos ${error}`,
      };
    }

    return response;
  };

  const remove = async (events) => {
    const event = {
      events: headers,
      queueUrl: config.queueUrl,
    };
    repositorySqs.remove(event);
  }

  return { send, remove };
};

module.exports = queueWrapper;
