/// <reference types="node" />

declare namespace Kafka {
  interface ClientMetadataBroker {
    id: number;
    host: string;
    port: number;
  }

  interface ClientMetadataPartition {
    id: number;
    leader: number;
    replicas: number[];
    isrs: number[];
  }

  interface ClientMetadataTopic {
    name: string;
    partitions: ClientMetadataPartition[];
  }

  interface ClientWatermarkOffsets {
    high: number;
    low: number;
  }

  interface ClientMetadata {
    orig_broker_id: number;
    orig_broker_name: string;
    brokers: ClientMetadataBroker[];
    topics: ClientMetadataTopic[];
  }

  interface MetadataOptions {
    topic?: string;
    allTopics?: boolean;
    timeout?: number;
  }

  type ConnectionCallback = (error: Error, clientMetadata: ClientMetadata) => void;
  type WatermarkOffsets = (error: Error, offsets: ClientWatermarkOffsets) => void;
  type ConsumerReadCallback = (error: LibrdKafkaError, message: KafkaConsumerMessage) => void;

  class Client extends NodeJS.EventEmitter {
    constructor(globalConf: any, subClientType: any, topicConf: any);
    _metadata: ClientMetadata;

    connect(metadataOptions?: MetadataOptions, cb?: ConnectionCallback): this;
    connectedTime(): number;
    disconnect(cb: ConnectionCallback): this;
    getClient(): any;
    getLastError(): LibrdKafkaError | null;
    getMetadata(metadataOptions?: MetadataOptions, cb?: ConnectionCallback): void;
    isConnected(): boolean;
    queryWatermarkOffsets(topic: string, partition: number, timeout: number, cb: WatermarkOffsets): void;
  }

  class ProducerStream extends Client implements NodeJS.WritableStream {
    writable: boolean;
    write(buffer: Buffer | string, cb?: Function): boolean;
    write(str: string, encoding?: string, cb?: Function): boolean;
    end(): void;
    end(buffer: Buffer, cb?: Function): void;
  }

  interface ProduceObject {

  }

  export class Producer extends Client {
    constructor(conf: any, topicConf: any);
    flush(timeout: number, cb: Function): this;
    poll(): Producer;
    produce(topic: string, partition: number | null, message: Buffer | null, key: string, timestamp: number | null, opaque: any): boolean
    setPollInterval(interval: number): this;

    static createWriteStream(globalConf: any, subClientType: any, topicConf: any): ProducerStream;
  }

  export module Producer {
    export class Topic {
      constructor(name: string, config: any);
    }
  }

  interface KafkaConsumerMessage {
    value: Buffer;
    topic: string;
    partition: number;
    offset: number;
    key: string;
    size: number;
  }

  export class KafkaConsumer extends Client {
    constructor(conf: any, topicConf: any);
    assign(assignments: any[]): this;
    assignments(): any[];
    commit(topicPartition: any | null): this;
    commitMessage(message: KafkaConsumerMessage): this;
    commitMessageSync(message: KafkaConsumerMessage): this;
    commitSync(topicPartition: any): this;
    committed(timeout: number, cb: Function): Client
    consume(size: number, cb: ConsumerReadCallback): void;
    consume(cb: ConsumerReadCallback): void;
    position(): any[];
    seek(toppar: any, timeout: number, cb: Function): Client;
    setDefaultConsumeTimeout(timeoutMs: number): void;
    subscribe(subscriptions: string[]): void;
    subscriptions(): string[];
    unassign(): Client;
    unsubscribe(): this;

    static createReadStream(globalConf: any, subClientType: any, topicConf: any): KafkaConsumerStream

  }

  interface KafkaConsumerOptions {
    waitInterval?: number;
    topics: any;
  }

  export class KafkaConsumerStream extends NodeJS.EventEmitter implements NodeJS.ReadableStream {
    constructor(consumer: KafkaConsumer, options: KafkaConsumerOptions | number)
    readable: boolean;
    read(size?: number): string | Buffer;
    setEncoding(encoding: string): this;
    pause(): this;
    resume(): this;
    isPaused(): boolean;
    pipe<T extends NodeJS.WritableStream>(destination: T, options?: { end?: boolean; }): T;
    unpipe<T extends NodeJS.WritableStream>(destination?: T): this;
    unshift(chunk: string): void;
    unshift(chunk: Buffer): void;
    wrap(oldStream: NodeJS.ReadableStream): NodeJS.ReadableStream;
  }

  export module CODES {
    export enum ERRORS {
      /** Begin internal error codes */
      ERR__BEGIN = -200,
      /** Received message is incorrect */
      ERR__BAD_MSG = -199,
      /** Bad/unknown compression */
      ERR__BAD_COMPRESSION = -198,
      /** Broker is going away */
      ERR__DESTROY = -197,
      /** Generic failure */
      ERR__FAIL = -196,
      /** Broker transport failure */
      ERR__TRANSPORT = -195,
      /** Critical system resource */
      ERR__CRIT_SYS_RESOURCE = -194,
      /** Failed to resolve broker */
      ERR__RESOLVE = -193,
      /** Produced message timed out*/
      ERR__MSG_TIMED_OUT = -192,
      /** Reached the end of the topic+partition queue on
       * the broker. Not really an error. */
      ERR__PARTITION_EOF = -191,
      /** Permanent: Partition does not exist in cluster. */
      ERR__UNKNOWN_PARTITION = -190,
      /** File or filesystem error */
      ERR__FS = -189,
      /** Permanent: Topic does not exist in cluster. */
      ERR__UNKNOWN_TOPIC = -188,
      /** All broker connections are down. */
      ERR__ALL_BROKERS_DOWN = -187,
      /** Invalid argument, or invalid configuration */
      ERR__INVALID_ARG = -186,
      /** Operation timed out */
      ERR__TIMED_OUT = -185,
      /** Queue is full */
      ERR__QUEUE_FULL = -184,
      /** ISR count < required.acks */
      ERR__ISR_INSUFF = -183,
      /** Broker node update */
      ERR__NODE_UPDATE = -182,
      /** SSL error */
      ERR__SSL = -181,
      /** Waiting for coordinator to become available. */
      ERR__WAIT_COORD = -180,
      /** Unknown client group */
      ERR__UNKNOWN_GROUP = -179,
      /** Operation in progress */
      ERR__IN_PROGRESS = -178,
      /** Previous operation in progress, wait for it to finish. */
      ERR__PREV_IN_PROGRESS = -177,
      /** This operation would interfere with an existing subscription */
      ERR__EXISTING_SUBSCRIPTION = -176,
      /** Assigned partitions (rebalance_cb) */
      ERR__ASSIGN_PARTITIONS = -175,
      /** Revoked partitions (rebalance_cb) */
      ERR__REVOKE_PARTITIONS = -174,
      /** Conflicting use */
      ERR__CONFLICT = -173,
      /** Wrong state */
      ERR__STATE = -172,
      /** Unknown protocol */
      ERR__UNKNOWN_PROTOCOL = -171,
      /** Not implemented */
      ERR__NOT_IMPLEMENTED = -170,
      /** Authentication failure*/
      ERR__AUTHENTICATION = -169,
      /** No stored offset */
      ERR__NO_OFFSET = -168,
      /** Outdated */
      ERR__OUTDATED = -167,
      /** Timed out in queue */
      ERR__TIMED_OUT_QUEUE = -166,
      /** Feature not supported by broker */
      ERR__UNSUPPORTED_FEATURE = -165,
      /** Awaiting cache update */
      ERR__WAIT_CACHE = -164,
      /** Operation interrupted */
      ERR__INTR = -163,
      /** Key serialization error */
      ERR__KEY_SERIALIZATION = -162,
      /** Value serialization error */
      ERR__VALUE_SERIALIZATION = -161,
      /** Key deserialization error */
      ERR__KEY_DESERIALIZATION = -160,
      /** Value deserialization error */
      ERR__VALUE_DESERIALIZATION = -159,
      /** End internal error codes */
      ERR__END = -100,

      /* Kafka broker errors: */
      /** Unknown broker error */
      ERR_UNKNOWN = -1,
      /** Success */
      ERR_NO_ERROR = 0,
      /** Offset out of range */
      ERR_OFFSET_OUT_OF_RANGE = 1,
      /** Invalid message */
      ERR_INVALID_MSG = 2,
      /** Unknown topic or partition */
      ERR_UNKNOWN_TOPIC_OR_PART = 3,
      /** Invalid message size */
      ERR_INVALID_MSG_SIZE = 4,
      /** Leader not available */
      ERR_LEADER_NOT_AVAILABLE = 5,
      /** Not leader for partition */
      ERR_NOT_LEADER_FOR_PARTITION = 6,
      /** Request timed out */
      ERR_REQUEST_TIMED_OUT = 7,
      /** Broker not available */
      ERR_BROKER_NOT_AVAILABLE = 8,
      /** Replica not available */
      ERR_REPLICA_NOT_AVAILABLE = 9,
      /** Message size too large */
      ERR_MSG_SIZE_TOO_LARGE = 10,
      /** StaleControllerEpochCode */
      ERR_STALE_CTRL_EPOCH = 11,
      /** Offset metadata string too large */
      ERR_OFFSET_METADATA_TOO_LARGE = 12,
      /** Broker disconnected before response received */
      ERR_NETWORK_EXCEPTION = 13,
      /** Group coordinator load in progress */
      ERR_GROUP_LOAD_IN_PROGRESS = 14,
      /** Group coordinator not available */
      ERR_GROUP_COORDINATOR_NOT_AVAILABLE = 15,
      /** Not coordinator for group */
      ERR_NOT_COORDINATOR_FOR_GROUP = 16,
      /** Invalid topic */
      ERR_TOPIC_EXCEPTION = 17,
      /** Message batch larger than configured server segment size */
      ERR_RECORD_LIST_TOO_LARGE = 18,
      /** Not enough in-sync replicas */
      ERR_NOT_ENOUGH_REPLICAS = 19,
      /** Message(s) written to insufficient number of in-sync replicas */
      ERR_NOT_ENOUGH_REPLICAS_AFTER_APPEND = 20,
      /** Invalid required acks value */
      ERR_INVALID_REQUIRED_ACKS = 21,
      /** Specified group generation id is not valid */
      ERR_ILLEGAL_GENERATION = 22,
      /** Inconsistent group protocol */
      ERR_INCONSISTENT_GROUP_PROTOCOL = 23,
      /** Invalid group.id */
      ERR_INVALID_GROUP_ID = 24,
      /** Unknown member */
      ERR_UNKNOWN_MEMBER_ID = 25,
      /** Invalid session timeout */
      ERR_INVALID_SESSION_TIMEOUT = 26,
      /** Group rebalance in progress */
      ERR_REBALANCE_IN_PROGRESS = 27,
      /** Commit offset data size is not valid */
      ERR_INVALID_COMMIT_OFFSET_SIZE = 28,
      /** Topic authorization failed */
      ERR_TOPIC_AUTHORIZATION_FAILED = 29,
      /** Group authorization failed */
      ERR_GROUP_AUTHORIZATION_FAILED = 30,
      /** Cluster authorization failed */
      ERR_CLUSTER_AUTHORIZATION_FAILED = 31,
      /** Invalid timestamp */
      ERR_INVALID_TIMESTAMP = 32,
      /** Unsupported SASL mechanism */
      ERR_UNSUPPORTED_SASL_MECHANISM = 33,
      /** Illegal SASL state */
      ERR_ILLEGAL_SASL_STATE = 34,
      /** Unuspported version */
      ERR_UNSUPPORTED_VERSION = 35,
      /** Topic already exists */
      ERR_TOPIC_ALREADY_EXISTS = 36,
      /** Invalid number of partitions */
      ERR_INVALID_PARTITIONS = 37,
      /** Invalid replication factor */
      ERR_INVALID_REPLICATION_FACTOR = 38,
      /** Invalid replica assignment */
      ERR_INVALID_REPLICA_ASSIGNMENT = 39,
      /** Invalid config */
      ERR_INVALID_CONFIG = 40,
      /** Not controller for cluster */
      ERR_NOT_CONTROLLER = 41,
      /** Invalid request */
      ERR_INVALID_REQUEST = 42,
      /** Message format on broker does not support request */
      ERR_UNSUPPORTED_FOR_MESSAGE_FORMAT = 43,
      /** Isolation policy volation */
      ERR_POLICY_VIOLATION = 44,
      /** Broker received an out of order sequence number */
      ERR_OUT_OF_ORDER_SEQUENCE_NUMBER = 45,
      /** Broker received a duplicate sequence number */
      ERR_DUPLICATE_SEQUENCE_NUMBER = 46,
      /** Producer attempted an operation with an old epoch */
      ERR_INVALID_PRODUCER_EPOCH = 47,
      /** Producer attempted a transactional operation in an invalid state */
      ERR_INVALID_TXN_STATE = 48,
      /** Producer attempted to use a producer id which is not
       *  currently assigned to its transactional id */
      ERR_INVALID_PRODUCER_ID_MAPPING = 49,
      /** Transaction timeout is larger than the maximum
       *  value allowed by the broker's max.transaction.timeout.ms */
      ERR_INVALID_TRANSACTION_TIMEOUT = 50,
      /** Producer attempted to update a transaction while another
       *  concurrent operation on the same transaction was ongoing */
      ERR_CONCURRENT_TRANSACTIONS = 51,
      /** Indicates that the transaction coordinator sending a
       *  WriteTxnMarker is no longer the current coordinator for a
       *  given producer */
      ERR_TRANSACTION_COORDINATOR_FENCED = 52,
      /** Transactional Id authorization failed */
      ERR_TRANSACTIONAL_ID_AUTHORIZATION_FAILED = 53,
      /** Security features are disabled */
      ERR_SECURITY_DISABLED = 54,
      /** Operation not attempted */
      ERR_OPERATION_NOT_ATTEMPTED = 55
    }
  }

  class LibrdKafkaError extends Error {
    message: string;
    code: number;
    origin: string;

    constructor(e: any | Error);
  }

  export function createWriteStream(globalConf: any, subClientType: any, topicConf: any): ProducerStream
  export function createReadStream(globalConf: any, subClientType: any, topicConf: any): KafkaConsumerStream
  export const features: string[];
  export const librdkafkaVersion: string;
}

declare module "node-rdkafka" {
  export = Kafka
}