'use strict';

const queueController = require('./queue');

const factory = (adapters) => {

  const sendMessage = queueController(adapters).send;

  return { sendMessage };
};

module.exports = factory;
