import {
  Component,
  ProviderMap,
  CoreBindings,
  Application,
  Server,
} from '@loopback/core';
import {inject, Constructor} from '@loopback/context';
import {MqttBinding} from './MqttBindingKeys';
import {MqttServer} from './mqtt.server';
import {MqttSequence} from './mqtt.sequence';
import {MqttServerConfig} from './types';
import {MqttProvider} from './providers/mqtt.provider';

export class mqttComponent implements Component {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
    @inject(MqttBinding.CONFIG) config: MqttServerConfig,
  ) {
    config = Object.assign(
      {
        host: '127.0.0.1',
        port: 1883,
      },
      config,
    );

    app.bind(MqttBinding.MQTT_HOST).to(config.host);
    app.bind(MqttBinding.MQTT_PORT).to(config.port);

    // A sequence will process every request made
    // app
    //   .bind(MqttBinding.MQTT_SEQUENCE)
    //   .toClass(config.sequence || MqttSequence);
  }

  servers: {[name: string]: Constructor<Server>} = {MqttServer};

  providers?: ProviderMap = {
    [MqttBinding.MQTT_PROVIDER.key]: MqttProvider,
  };
}
