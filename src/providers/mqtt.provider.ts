import {Provider} from '@loopback/context';
import {Message} from 'amqplib';
import {MessageStore} from '../store/message.store';

export class MqttProvider implements Provider<Message[]> {
  value(): Promise<Message[]> {
    return Promise.resolve(MessageStore.getInstance().retrieveMessages());
  }
}
