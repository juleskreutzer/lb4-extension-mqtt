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
import {Message} from 'amqplib';
import {MessageStore} from '../store';
import * as Amqp from 'amqp-ts';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class MqttObserver implements LifeCycleObserver {
  private _config: RabbitMQConfig;
  private _connection: Amqp.Connection;

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject(MqttBinding.CONFIG) protected mqttConfig: MqttServerConfig,
    @inject(MqttBinding.MQTT_EXCHANGE) protected exchange: string,
    @inject(MqttBinding.MQTT_QUEUE) protected queue: string,
  ) {
    this.checkConfiguration();

    const url =
      this.mqttConfig.protocol +
      this.mqttConfig.user +
      ':' +
      this.mqttConfig.pass +
      '@' +
      this.mqttConfig.host +
      ':' +
      this.mqttConfig.port +
      '/' +
      this.mqttConfig.vhost;

    this._connection = new Amqp.Connection(url);
  }

  /**
   * This method will be invoked when the application starts
   */
  async start(): Promise<void> {
    // // Add your logic for start

    let exchange: Amqp.Exchange = this._connection.declareExchange(
      this.exchange,
    );
    let queue: Amqp.Queue = this._connection.declareQueue(this.queue);
    queue.bind(exchange);

    queue.activateConsumer((message: Message) => {
      console.info('Received message', message.content);
      MessageStore.getInstance().pushMessage(message);
    });

    this._connection.completeConfiguration().catch(error => {
      throw new Error(error);
      process.exit();
    });
  }

  /**
   * This method will be invoked when the application stops
   */
  async stop(): Promise<void> {
    // Add your logic for start
    await this._connection.close();
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
