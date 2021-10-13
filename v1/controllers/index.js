'use strict';

const factory = require('./factory');
const config = require('../../config');
const { repositorySqs } = require('../repository/sqs')({ config });

const adapters = require('../adapters')({ repositorySqs, config });

module.exports = factory(adapters);
