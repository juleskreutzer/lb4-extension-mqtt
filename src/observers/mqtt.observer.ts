import {
  /* inject, Application, CoreBindings, */
  lifeCycleObserver, // The decorator
  CoreTags,
  LifeCycleObserver,
  inject,
  CoreBindings,
  Application, // The interface
} from '@loopback/core';
import {MqttServerConfig, RabbitMQConfig} from '../types';
import {MqttBinding} from '../MqttBindingKeys';
import {Broker} from 'typescript-rabbitmq';
import {Message} from 'amqplib';
import {MessageStore} from '../store';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class MqttObserver implements LifeCycleObserver {
  private _config: RabbitMQConfig;
  private _broker: Broker;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject(MqttBinding.CONFIG) protected mqttConfig: MqttServerConfig,
    @inject(MqttBinding.MQTT_EXCHANGE) protected exchange: string,
    @inject(MqttBinding.MQTT_QUEUE) protected queue: string,
  ) {
    this.checkConfiguration();

    this._config = {
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

    this._broker = new Broker(this._config);
  }

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // Add your logic for start
    console.info('Connecting to broker...');
    await this._broker.connect();
    console.info('Connected to broker!');

    this._broker.addConsume(this.queue, (message: Message) => {
      console.info('Received message: message');
      MessageStore.getInstance().pushMessage(message);
    });
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for start
    await this._broker.close();
  }

  checkConfiguration() {
    if (!this.exchange) {
      console.error('MQTT Exchange not set');
      process.exit();
    }
    if (!this.queue) {
      console.error('MQTT Queue not set');
      process.exit();
    }
  }
}
