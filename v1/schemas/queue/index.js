'use strict';

const Joi = require('joi');

module.exports = {
  request: {
    header: Joi.object({
      consumersystem: Joi.string().optional(),
      correlationid: Joi.string().optional(),
    }).unknown(),
    queue: {
      customerId: Joi.string().required(),
      fullName: Joi.string().required(),
    },
  },
};
