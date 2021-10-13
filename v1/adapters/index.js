'use strict';

const queueWrapper = require('./queue');

module.exports = dependencies => ({
  send: queueWrapper({
    repositorySqs: dependencies.repositorySqs,
    config: dependencies.config,
  }).send,
  remove: queueWrapper({
    repositorySqs: dependencies.repositorySqs,
    config: dependencies.config,
  }).remove,
});
