'use strict';

const queueWrapper = (adapters) => {
  const send = async (request) => {
    const events = {
      body: request.body,
      headers: request.headers,
    };

    const response = await adapters.send(events);

    // Tratar apenas os erros de insert no SQS, os erros de formatação não prcisam.

    //Precisa validar o retorno e salvar para identificar os registros que não foram processados?
    //return response;

    return {
      statusCode: 200,
      body: `Recebemos ${response.eventGroupReceived.length} mensagens e destas processamos um total de ${response.processingStatus.successful.length} com sucesso! Quantidade de mensagens com erro ${response.processingStatus.failed.length}`,
      response,
    };
  };

  const remove = async (events) => {
    return await adapters.remove(events);
  };

  return {
    send,
  };
};

module.exports = queueWrapper;
