import {Message} from 'amqplib';

export class MessageStore {
  private static _instance: MessageStore;
  private messageList: Message[];

  private constructor() {
    this.messageList = [];
  }

  static getInstance(): MessageStore {
    if (!MessageStore._instance) {
      MessageStore._instance = new MessageStore();
    }

    return MessageStore._instance;
  }

  pushMessage(message: Message) {
    this.messageList.push(message);
  }

  retrieveMessages(): Message[] {
    // Place the current messages in a temporary value
    const temp: Message[] = this.messageList;

    // consider that all messages will be handled after they are returned by this method.
    // We won't need to save the messages, so we can delete them
    this.messageList = [];
    return temp;
  }
}
