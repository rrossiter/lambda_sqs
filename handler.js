'use strict';

require('dotenv').config();

const queueController = require('./v1/controllers/queue');

module.exports.handler = async (event, context) => {
    return queueController().send(event);
};