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
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
    @inject(MqttBinding.CONFIG) public config: MqttServerConfig,
  ) {
    this.checkConfiguration();

    app.bind(MqttBinding.MQTT_HOST).to(config.host);
    app.bind(MqttBinding.MQTT_PORT).to(config.port);
    app.bind(MqttBinding.MQTT_USER).to(config.user);
    app.bind(MqttBinding.MQTT_PASS).to(config.pass);

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
  }
}
