import { action, computed, makeObservable, observable } from 'mobx';

interface MessageItem {
  message: string;
  msgtype: number;
}

export class MessageStoreImpl {
  messages: MessageItem[] = [];

  constructor() {
    makeObservable(this, {
      messages: observable,
      addInfo: action,
      addError: action,
      clearStore: action,
    });
  }

  removeOld() {
    if (this.messages.length > 50) {
      this.messages.shift();
    }
  }

  addInfo(messageText: string) {
    const item: MessageItem = {
      message: messageText,
      msgtype: 0,
    };
    this.removeOld();
    this.messages.push(item);
  }

  addError(messageText: string) {
    const item: MessageItem = {
      message: messageText,
      msgtype: 1,
    };
    this.removeOld();
    this.messages.push(item);
  }

  clearStore() {
    this.messages.length = 0;
  }
}

export const MessageStore = new MessageStoreImpl();
