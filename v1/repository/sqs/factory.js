'use strict';

const uuidv4 = require('uuid/v4');

const wrapper = ({ sqs, config }) => {

  const sendMessageBatch = async (event) => {

    const response = [];

    /** Execução ocorre em paralelo e sem ordem, não espera o termino para retornar. **/

    /*** 
     * 
      event.eventGroup.forEach(async group => {
      var params = {
        QueueUrl: event.queueUrl,
        Entries: []
      };
      group.forEach(message => {
        params.Entries.push({
          Id: uuidv4(),
          MessageBody: JSON.stringify(message)
        });
      })
      console.log(params);
      response.push(await sqs.sendMessageBatch(params).promise());
      console.log(response);
    });
     * 
     ***/

    /** Execução ocorre de forma sequencial e em ordem, espera o termino para retornar. **/
    try {

      for (const group of event.eventGroup) {
        var params = {
          QueueUrl: event.queueUrl,
          Entries: []
        };
        for (const message of group) {
          params.Entries.push({
            Id: uuidv4(),
            MessageBody: JSON.stringify(message)
          });
        }

        console.log(JSON.stringify(params));
        const { Successful, Failed } = await sqs.sendMessageBatch(params).promise();

        response.push({
          Successful,
          Failed
        });

      }
    }
    catch (error) {
      console.log(error);

      throw {
        statusCode: 400,
        body: JSON.stringify(error),
      }
    }

    return response;
  };


  const deleteMessageBatch = async (event) => {

    var params = {
      QueueUrl: event.queueUrl,
      Entries: []
    };

    for (const item of event.events) {
      params.Entries.push({
        Id: item.Id,
        ReceiptHandle: item.MessageId,
      })
    }

    sqs.deleteMessageBatch(params).promise();
  };

  return { sendMessageBatch, deleteMessageBatch };
}

module.exports = wrapper;
