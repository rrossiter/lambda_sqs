'use strict';

const { v4: uuidv4 } = require('uuid');

const wrapper = ({ sqs, config }) => {

  const sendMessageBatch = async (event, teste) => {
    const response = [];

    // #region foreach
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
    // #endregion

    /** Execução ocorre de forma sequencial e em ordem, espera o termino para retornar. **/
    try {

      for (const group of event.group) {
        const params = {
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
        const { Successful = [], Failed = [] } = await sqs.sendMessageBatch(params).promise();
        response.push({ Successful, Failed });
      }
    }
    catch (error) {
      throw error;
    }
    return response;
  };


  const deleteMessageBatch = async (event) => {
    const params = {
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
