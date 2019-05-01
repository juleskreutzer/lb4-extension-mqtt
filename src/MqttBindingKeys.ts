import {BindingKey, CoreBindings} from '@loopback/core';
import {IMqttSequence} from './mqtt.sequence';

export namespace MqttBinding {
  export const MQTT_HOST = BindingKey.create<string>('mqtt.host');
  export const MQTT_PORT = BindingKey.create<number>('mqtt.port');
  export const MQTT_USER = BindingKey.create<string>('mqtt.user');
  export const MQTT_PASS = BindingKey.create<string>('mqtt.pass');

  export const MQTT_EXCHANGE = BindingKey.create<string>('mqtt.exchange');
  export const MQTT_QUEUE = BindingKey.create<string>('mqtt.queue');

  export const CONFIG = `${CoreBindings.APPLICATION_CONFIG}.mqtt`;
  export const MQTT_SEQUENCE = BindingKey.create<IMqttSequence>(
    'mqtt.sequence',
  );

  export const MQTT_PROVIDER = BindingKey.create<string>('mqtt.provider');
}
