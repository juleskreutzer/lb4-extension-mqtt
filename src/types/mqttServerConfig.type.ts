export type MqttServerConfig = {
  port: number;
  host: string;
  user: string;
  pass: string;
  protocol: string;
  vhost: string;

  // tslint:disable-next-line:no-any
  [key: string]: any;
};
