/*
 * node-rdkafka - Node.js wrapper for RdKafka C/C++ library
 *
 * Copyright (c) 2016 Blizzard Entertainment
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */
'use strict';

module.exports = Consumer;

var Client = require('./client');
var util = require('util');
var Kafka = require('../librdkafka.js');
var LibrdKafkaError = require('./error');

util.inherits(Consumer, Client);

/**
 * KafkaConsumer class for reading messages from Kafka
 *
 * This is the main entry point for reading data from Kafka. You
 * configure this like you do any other client, with a global
 * configuration and default topic configuration.
 *
 * Once you instantiate this object, connecting will open a socket.
 * Data will not be read until you tell the consumer what topics
 * you want to read from.
 *
 * @param {object} conf - Key value pairs to configure the consumer
 * @param {object} topicConf - Key value pairs to create a default
 * topic configuration
 * @extends Client
 * @constructor
 */
function Consumer(conf, topicConf) {
  if (!(this instanceof Consumer)) {
    return new Consumer(conf, topicConf);
  }

  var self = this;

  /**
   * Consumer message.
   *
   * This is the representation of a message read from Kafka.
   *
   * @typedef {object} Consumer~Message
   * @property {buffer} value - the message buffer from Kafka.
   * @property {string} topic - the topic name
   * @property {number} partition - the partition on the topic the
   * message was on
   * @property {number} offset - the offset of the message
   * @property {string} key - the message key
   * @property {number} size - message size, in bytes.
   */

  Client.call(this, conf, Kafka.Consumer, topicConf);

  this.globalConfig = conf;
  this.topicConfig = topicConf;
}

/**
 * Start consuming messages from the provided topic and partition
 *
 * @param {string} topic - Topic to start consuming from
 * @param {number} partition - Partition to start consuming from
 */
Consumer.prototype.start = function(topic, partition, offset) {

};

/**
 * Stop consuming messages from the provided topic and partition
 *
 * @param {string} topic - Topic to stop consuming from
 * @param {number} partition - Partition to stop consuming from
 */
Consumer.prototype.stop = function(topic, partition) {

};

/**
 * Seek the consumer for a topic partition to a provided offset
 *
 * @param {string} topic - Topic to seek
 * @param {number} partition - Partition to seek
 * @param {number} offset - Offset to seek to
 * @param {number} timeout - Number of ms to wait for the seek to complete
 * @param {Function} callback - Callback. Will have an error as first parameter
 * if the seek failed
 */
Consumer.prototype.seek = function(topic, partition, offset, timeout, callback) {

};

/**
 * This callback returns the message read from Kafka.
 *
 * @callback Consumer~consumeCallback
 * @param {LibrdKafkaError} err - An error, if one occurred while reading
 * the data.
 * @param {Consumer~Message} message
 */

/**
 * Consume messages from Kafka
 *
 * Consume messages from Kafka, calling the callback for each message consumed.
 * As this has higher throughput than the generic consume method, and we are in
 * node, it feels this is the better fit for implementation
 *
 * @param {string} topic - Topic to read messages from.
 * @param {number} partition - Partition to read messages from
 * @param {timeout} timeout - How long to wait for messages to be returned.
 * @param {Consumer~consumeCallback} cb - Callback to return when work is done.
 */
Consumer.prototype.consume = function(topic, partition, timeout, callback) {

};
