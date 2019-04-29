export class Broker {
  constructor(config: any);
  ch: any;
  consumes: any;
  config: any;
  addBinding(exchange: any, target: any, keys: any): any;
  addConsume(queue: any, cb: any, init?: any): any;
  addExchange(name: any, type: any, options: any): any;
  addQueue(name: any, options: any): any;
  close(): void;
  connect(): any;
  createQueue(q: any): any;
  init(): any;
  initQueueCB(q_created: any): any;
  send(ex: any, key: any, msg: any, options: any, noAck: any): void;
}
export default class _default {
  constructor(config: any);
  ch: any;
  consumes: any;
  config: any;
  addBinding(exchange: any, target: any, keys: any): any;
  addConsume(queue: any, cb: any, init: any): any;
  addExchange(name: any, type: any, options: any): any;
  addQueue(name: any, options: any): any;
  close(): void;
  connect(): any;
  createQueue(q: any): any;
  init(): any;
  initQueueCB(q_created: any): any;
  send(ex: any, key: any, msg: any, options: any, noAck: any): void;
}
export const defaultConfig: {
  binding: any[];
  connection: {
    host: string;
    name: string;
    pass: any;
    port: string;
    timeout: number;
    user: any;
  };
  exchanges: any[];
  logging: {
    adapters: {
      stdOut: {
        bailIfDebug: any;
        level: any;
      };
    };
  };
  queues: any[];
};
