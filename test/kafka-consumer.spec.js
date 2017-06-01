/*
 * node-rdkafka - Node.js wrapper for RdKafka C/C++ library
 *
 * Copyright (c) 2016 Blizzard Entertainment
 *
 * This software may be modified and distributed under the terms
 * of the MIT license.  See the LICENSE.txt file for details.
 */

// This test is intended to be a javascript layer test, so all the underlying calls will be mocked.

var mock = require('mock-require');

// Mock the librdkafka object so we can do some testing
var librdkafka = {};
mock('../librdkafka.js', librdkafka);

var KafkaConsumer = require('../lib/kafka-consumer');
var t = require('assert');

var client;
var defaultConfig = {
  'client.id': 'kafka-mocha',
  'group.id': 'kafka-mocha-grp',
  'metadata.broker.list': 'localhost:9092'
};

describe('KafkaConsumer javascript client', function() {

  // Before each test run, set required methods on prototype
  beforeEach(function() {
    librdkafka.KafkaConsumer = function(globalConfig, topicConfig) {
      this.globalConfig = globalConfig;
      this.topicConfig = topicConfig;
    };

    librdkafka.KafkaConsumer.prototype.onEvent = function() {

    };
  });

  it('should be an object', function() {
    var client = new KafkaConsumer({});
    t.equal(typeof(client), 'object');
  });

  it('should require configuration to be passed in', function() {
    t.throws(function() {
      return new KafkaConsumer();
    });
  });

  it('should register an event handler with the underlying client', function() {
    var listenerRegistered = false;
    librdkafka.KafkaConsumer.prototype.onEvent = function() {
      listenerRegistered = true;
    };

    var client = new KafkaConsumer({});

    t.equal(listenerRegistered, true, 'Listener should have registered with onEvent');
  });

  describe('rebalance callback', function() {
    it('should create a proxy function for rebalance', function() {
      var functionCalled = false;
      var client = new KafkaConsumer({
        'rebalance_cb': function(err, assignments) {
          functionCalled = true;
          // Make sure this is bound appropriately
          t.equal(this instanceof KafkaConsumer, true);
        }
      });

      var rebalanceCb = client._client.globalConfig.rebalance_cb;
      t.equal(typeof rebalanceCb, 'function', 'Rebalance cb was not passed through in the config');

      var emitterCalled = false;
      client.on('rebalance', function(err, assignments) {
        emitterCalled = true;
      });

      rebalanceCb(0, []);

      t.equal(emitterCalled, true, 'Emitter was never called');
      t.equal(functionCalled, true, 'Function was never called');
    });

    it('should convert no error code into undefined error', function() {
      var functionCalled = false;
      var client = new KafkaConsumer({
        'rebalance_cb': function(err, assignments) {

        }
      });

      var rebalanceCb = client._client.globalConfig.rebalance_cb;
      t.equal(typeof rebalanceCb, 'function', 'Rebalance cb was not passed through in the config');

      var emitterCalled = false;
      client.on('rebalance', function(err, assignments) {
        t.ifError(err);
        emitterCalled = true;
        t.deepEqual(assignments, [], 'Should have had no assignments to pass in');
      });

      rebalanceCb(0, []);
    });
  });

});
