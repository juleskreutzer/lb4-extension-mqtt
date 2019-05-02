# lb4-extension-mqtt

An MQTT extension for LoopBack 4.

## Installation

Run the following command to install `lb4-extension-mqtt`:

```npm
npm i -s lb4-extension-mqtt
```

## Usage

When the `lb4-extension-mqtt` package is installed, bind it to your application with `app.component()`

```typescript
import {RestApplication} from '@loopback/rest';
import {MqttComponent} from 'lb4-extension-mqtt';

const app = new RestApplication();
// Keep in mind that some extra configuration is required
// as shown in the following steps
app.component(MqttComponent);
```

### Configuration

To make a connection, you'll have to bind some values that will be provided to the extension.

**Tip:** Use `MqttBinding` from `lb4-extension-mqtt/dist10`

| MqttBinding   |                Binding Key                |                                               What we need |
| ------------- | :---------------------------------------: | ---------------------------------------------------------: |
| MQTT_CONFIG   | `${CoreBindings.APPLICATION_CONFIG}.mqtt` | Configuration, see [MqttServerConfig](#mqtt-server-config) |
| MQTT_EXCHANGE |               mqtt.exchange               |                                              MQTT Exchange |
| MQTT_QUEUE    |                mqtt.queue                 |                                                 MQTT Queue |

### Mqtt Server Config

The MQTT Server config holds the configuration for the server connection.

**Tip**: Use `MqttServerConfig` type from `lb4-extension-mqtt/dist10/types`

```typescript
const config: MqttServerConfig = {
  protocol: process.env.MQTT_PROTOCOL || 'amqp://',
  vhost: process.env.MQTT_VHOST || 'someVhost',
  host: process.env.MQTT_HOST || 'localhost',
  port: process.env.MQTT_PORT === undefined ? 8883 : +process.env.MQTT_PORT,
  user: process.env.MQTT_USER || 'user',
  pass: process.env.MQTT_PASS || 'pass',
};

this.bind(MqttBinding.CONFIG).to(config);
```

### Retrieve messages

When a message is received from the message queue, it is stored in an array with type `Message[]` where `Message` is imported from `amqplib`.

The extension exports the messages using a [Provider](https://loopback.io/doc/en/lb4/Creating-components.html#providers). You can use the inject the value of this provider using the following key:

| MqttBinding   |  Binding Key  |
| ------------- | :-----------: |
| MQTT_PROVIDER | mqtt.provider |

When injecting in your class, you'll only receive the value once since you can't inject the value multiple times in the same instance.

An example to retrieve the value with an interval:

```typescript
import {MqttBinding} from 'lb4-extension-mqtt/dist10';

class CheckMqttComponent {
  // This will inject the MqttComponent's provider
  constructor(@inject(MqttBinding.MQTT_PROVIDER) public provider: Message[]) {}

  getMessages(): Message[] {
    // This will return a list of all received messages
    // since the last time you called this function
    return this.provider;
  }
}

class SomeOtherClass {
  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
  ) {
    this.checkForNewMqttMessages();
  }

  private checkForNewMqttMessages() {
    setInterval(async () => {
      const checkMqttComponent: CheckMqttComponent = new CheckMqttComponent(
        await this.app.get(MqttBinding.MQTT_PROVIDER),
      );

      const messages: Message[] = checkMqttComponent.getMessages();
      for (let message of messages) {
        // Do something amazing with it!
      }
    }, 15000);
  }
}
```

## Development & issues

If you need help with using this extension, feel free to open an issue.

If you think that this extension could use some improvements, feel free to open a PR.

### License

[MIT](https://github.com/juleskreutzer/lb4-extension-mqtt/blob/master/LICENSE)

[![LoopBack](<https://github.com/strongloop/loopback-next/raw/master/docs/site/imgs/branding/Powered-by-LoopBack-Badge-(blue)-@2x.png>)](http://loopback.io/)
