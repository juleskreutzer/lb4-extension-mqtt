export type RabbitMQConfig = {
  connection?: object;
  exchanges?: object[];
  queues?: object[];
  binding?: object[];
  [key: string]: any;
};
