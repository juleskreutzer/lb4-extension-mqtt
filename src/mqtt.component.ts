import {
  Component,
  ProviderMap,
  CoreBindings,
  Application,
  Server,
} from '@loopback/core';
import {inject, Constructor} from '@loopback/context';
import {MqttBinding} from './MqttBindingKeys';
import {MqttSequence} from './mqtt.sequence';
import {MqttServerConfig} from './types';
import {MqttProvider} from './providers/mqtt.provider';
import {MqttObserver} from './observers';

export class MqttComponent implements Component {
  constructor(@inject(MqttBinding.CONFIG) public config: MqttServerConfig) {
    this.checkConfiguration();

    // A sequence will process every request made
    // app
    //   .bind(MqttBinding.MQTT_SEQUENCE)
    //   .toClass(config.sequence || MqttSequence);
  }

  lifeCycleObservers = [MqttObserver];

  providers?: ProviderMap = {
    [MqttBinding.MQTT_PROVIDER.key]: MqttProvider,
  };

  checkConfiguration() {
    if (!this.config.host) {
      console.error('MQTT Host not set');
      process.exit();
    }
    if (!this.config.pass) {
      console.error('MQTT Pass not set');
      process.exit();
    }
    if (!this.config.port) {
      console.error('MQTT Port not set');
      process.exit();
    }
    if (!this.config.user) {
      console.error('MQTT User not set');
      process.exit();
    }
    if (!this.config.protocol) {
      console.error('MQTT Protocol not set');
      process.exit();
    }
    if (!this.config.vhost) {
      console.error('MQTT Vhost not set');
      process.exit();
    }
  }
}
