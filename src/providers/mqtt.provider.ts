import {Provider} from '@loopback/context';
import {MessageStore} from '../store/message.store';
import * as Amqp from 'amqp-ts';

export class MqttProvider implements Provider<Amqp.Message[]> {
  value(): Promise<Amqp.Message[]> {
    return Promise.resolve(MessageStore.getInstance().retrieveMessages());
  }
}
