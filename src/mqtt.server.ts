import {Server, CoreBindings, Application} from '@loopback/core';
import {Context, inject} from '@loopback/context';
import {MqttBinding} from './MqttBindingKeys';
import {Broker} from 'typescript-rabbitmq';
import {MqttServerConfig, RabbitMQConfig} from './types';
import {Message} from 'amqplib';
import {MessageStore} from './store/message.store';

export class MqttServer extends Context implements Server {
  private _listening: boolean;
  private config: RabbitMQConfig;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) protected app: Application,
    @inject(MqttBinding.CONFIG) protected mqttConfig: MqttServerConfig,
    @inject(MqttBinding.MQTT_BROKER) protected broker: Broker,
    @inject(MqttBinding.MQTT_EXCHANGE) protected exchange: string,
    @inject(MqttBinding.MQTT_QUEUE) protected queue: string,
  ) {
    super(app);

    // setup Broker config
    this.config = {
      connection: {
        user: this.mqttConfig.user,
        pass: this.mqttConfig.pass,
        host: this.mqttConfig.host,
        port: this.mqttConfig.port,
        timeout: 2000,
        name: 'rabbitmq',
      },
      exchanges: [
        {
          name: this.exchange,
          type: 'topic',
          options: {publishTimeout: 1000, persistent: true, durable: false},
        },
      ],
      queues: [
        {
          name: this.queue,
          options: {limit: 1000, queueLimit: 1000},
        },
      ],
      binding: [
        {
          exchange: this.exchange,
          target: this.queue,
          keys: 'lb4',
        },
      ],
      logging: {
        adapters: {
          stdOut: {
            level: 3,
            bailIfDebug: false,
          },
        },
      },
    };

    this.broker = new Broker(this.config);
  }

  public get listening() {
    return this._listening;
  }

  async start(): Promise<void> {
    await this.broker.connect();

    this.broker.addConsume(this.queue, this.onNewMessage.bind(this));
  }

  onNewMessage(message: Message) {
    MessageStore.getInstance().pushMessage(message);
  }

  async stop(): Promise<void> {}
}
