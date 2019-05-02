import * as Amqp from 'amqp-ts';
export class MessageStore {
  private static _instance: MessageStore;
  private messageList: Amqp.Message[];

  private constructor() {
    this.messageList = [];
  }

  static getInstance(): MessageStore {
    if (!MessageStore._instance) {
      MessageStore._instance = new MessageStore();
    }

    return MessageStore._instance;
  }

  pushMessage(message: Amqp.Message) {
    this.messageList.push(message);
  }

  retrieveMessages(): Amqp.Message[] {
    // Place the current messages in a temporary value
    const temp: Amqp.Message[] = this.messageList;

    // consider that all messages will be handled after they are returned by this method.
    // We won't need to save the messages, so we can delete them
    this.messageList = [];
    return temp;
  }
}
