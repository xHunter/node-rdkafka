/*
 * node-rdkafka - Node.js wrapper for RdKafka C/C++ library
 *
 * Copyright (c) 2016 Blizzard Entertainment
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

var KafkaConsumer = require('./kafka-consumer');
var Consumer = require('./consumer');
var Producer = require('./producer');
var error = require('./error');
var util = require('util');

module.exports = {
  Producer: Producer,
  KafkaConsumer: KafkaConsumer,
  Consumer: Consumer,
  CODES: {
    REBALANCE: {
      PARTITION_ASSIGNMENT: 500,
      PARTITION_UNASSIGNMENT: 501
    },
    ERRORS: error.codes
  }
};
