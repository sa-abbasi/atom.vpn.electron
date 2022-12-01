const WebSocket = require('ws');

class SdkChannel {
  constructor(test) {
    this.test = test;
    this.sdkUrl = 'ws://0.0.0.0:8081';
    this.requestId = 0;
    this.requestQue = new Map();
    this.self = this;
    this.OnSocketMessage.bind(this);
  }

  InitializeWebSocket() {
    console.log('creating new WebSocket object %s', this.sdkUrl);

    this.socket = new WebSocket(this.sdkUrl);

    this.socket.onopen = function (e) {
      console.log(`websocket has opened ${e}`);
    };

    this.socket.onclose = function (e) {
      console.log(
        `websocket has closed e.code: ${e.code}, e.wasClean: ${e.wasClean}`
      );
    };

    this.socket.onerror = function (e) {
      console.log(`websocket.onerror e.message ${e.message}`);
    };

    // Listen for messages

    this.socket.onmessage = this.OnSocketMessage;
    this.socket.holder = this;
  }

  getNextRequestId() {
    this.requestId++;
    return this.requestId;
  }

  logReceivedMessage(data) {
    if (data.length > 80) {
      const data2 = data.substring(0, 80);
      console.log(
        `SdkChannel->OnSocketMessage received message from websocket ${data2}`
      );
    } else {
      console.log(
        `SdkChannel->OnSocketMessage received message from websocket ${data}`
      );
    }
  }

  OnSocketMessage(e) {
    const channel = this.holder;
    channel.logReceivedMessage(e.data);

    const data = JSON.parse(e.data);

    if (data.hasOwnProperty('RequestId')) {
      try {
        let requestId = parseInt(data.RequestId);

        console.log(
          `SdkChannel->OnSocketMessage received message has RequestId: ${requestId}`
        );

        let callBackState = channel.requestQue.get(requestId);
        callBackState.status = 1;
        console.log(
          `SdkChannel->OnSocketMessage Obtained callbackState from Map`
        );

        channel.requestQue.delete(requestId);

        console.log(`SdkChannel->OnSocketMessage Calling State.Resolve()`);

        callBackState.resolve(data);
        console.log(
          `SdkChannel->OnSocketMessage State.Resolve() has been called`
        );
        return;
      } catch (error) {
        console.log(`SdkChannel->OnSocketMessage error ${error}`);
      }
    } else {
      console.log(
        'SdkChannel->OnSocketMessage received message does not have RequestId property: '
      );
    }
  }

  sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  //Private
  async ConnectSocket() {
    if (this.socket === undefined) {
      this.InitializeWebSocket();
      await this.sleep(100);
      return;
    }

    if (this.socket.readyState !== 1) {
      this.InitializeWebSocket();
      await this.sleep(100);
    }
  }

  async isSocketReady(socket, timeout = 10000) {
    const isOpened = () => socket.readyState === WebSocket.OPEN;

    if (socket.readyState !== WebSocket.CONNECTING) {
      console.log(`isSocketReady socket.readyState: ${socket.readyState}`);
      return isOpened();
    }

    console.log('isSocketReady loop_state');

    const intrasleep = 100;
    const ttl = timeout / intrasleep; // time to loop
    let loop = 0;
    while (socket.readyState === WebSocket.CONNECTING && loop < ttl) {
      await new Promise((resolve) => setTimeout(resolve, intrasleep));
      loop++;
    }
    return isOpened();
  }

  //Private, should be called only from sdkchannel
  SendMessage(messageObject) {
    return new Promise(async (resolve, reject) => {
      console.log(`calling SdkChannel.isSocketReady`);

      const isready = await this.isSocketReady(this.socket);
      const state = { resolve, reject, status: 0 };

      console.log(`after SdkChannel.isSocketReady isready_status : ${isready}`);

      if (isready) {
        messageObject['RequestId'] = this.getNextRequestId();

        this.requestQue.set(messageObject.RequestId, state);

        const strMessage = JSON.stringify(messageObject);

        console.log(`SdkChannel->SendMessage ${strMessage}`);

        this.socket.send(strMessage);
      }

      setInterval(() => {
        if (state.status === 0) {
          state.status = 1;
          reject('VPN SDK timedout connect request');
        }
      }, 10000);
    });
  }

  async Connect(psk, user_name, password) {
    await this.ConnectSocket();

    const request = {
      MessageType: 2,
      PSK: psk,
      UserId: user_name,
      Password: password,
    };

    return this.SendMessage(request);
  }

  async GetCountries() {
    await this.ConnectSocket();

    const request = {
      MessageType: 4,
    };

    return this.SendMessage(request);
  }
}

module.exports = {
  SdkChannel,
};

/*
Socet

 public enum MessageType : int
    {
        Invalid = 1,
        Connect = 2,
        Disconnect = 3,
        GetCountryList = 4,
        GetProtocols = 5,
        GetCities = 6

    }


0	CONNECTING	Socket has been created. The connection is not yet open.
1	OPEN	The connection is open and ready to communicate.
2	CLOSING	The connection is in the process of closing.
3	CLOSED
*/
