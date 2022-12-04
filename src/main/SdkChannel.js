const WebSocket = require('ws');

class SdkChannel {
  constructor(test) {
    this.test = test;
    this.sdkUrl = 'ws://0.0.0.0:8081';
    this.requestId = 0;
    this.requestQue = new Map();
    this.self = this;
    this.OnSocketMessage.bind(this);
    this.MessageForwarder = null;
    this.SetMessageForwarder = this.SetMessageForwarder.bind(this);
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
      if (channel.MessageForwarder != null) {
        channel.MessageForwarder(e.data);
      } else {
        console.log('socket MessageForwarder is null');
      }
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

      let callbackInterval = 1000 * 12;
      if (messageObject.hasOwnProperty('timeOut')) {
        callbackInterval = messageObject.timeOut;
        if (callbackInterval < 12000) {
          callbackInterval = 12 * 1000;
        }
      }

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
      }, callbackInterval);
    });
  }

  async ConnectSDK(psk, user_name, password) {
    await this.ConnectSocket();

    const request = {
      MessageType: 2,
      PSK: psk,
      UserId: user_name,
      Password: password,
      timeOut: 12000,
    };

    return this.SendMessage(request);
  }

  async DisConnectSDK() {
    await this.ConnectSocket();

    const request = {
      MessageType: 3,
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

  async GetProtocols() {
    await this.ConnectSocket();

    const request = {
      MessageType: 5,
    };

    return this.SendMessage(request);
  }

  async GetCities() {
    await this.ConnectSocket();

    const request = {
      MessageType: 6,
    };

    return this.SendMessage(request);
  }

  async ConnectVPN(command) {
    await this.ConnectSocket();

    return this.SendMessage(command);
  }

  async DisconnectVPN() {
    await this.ConnectSocket();

    const request = {
      MessageType: 8,
    };

    return this.SendMessage(request);
  }

  async ProcessCommand(command) {
    if (command.MessageType === 2) {
      // Returning promise
      return this.ConnectSDK(command.psk, command.username, command.password);
    }

    if (command.MessageType === 3) {
      // Returning promise
      return this.DisConnectSDK();
    }

    if (command.MessageType === 4) {
      return this.GetCountries();
    }

    if (command.MessageType === 5) {
      return this.GetProtocols();
    }

    if (command.MessageType === 6) {
      return this.GetCities();
    }

    if (command.MessageType === 7) {
      return this.ConnectVPN(command);
    }

    if (command.MessageType === 8) {
      return this.DisconnectVPN();
    }

    return {
      isok: true,
      message:
        'Please check ProcessCommand in SdkChannel.js, this message is not handled yet',
    };
  }

  SetMessageForwarder(CallBackFunction) {
    this.MessageForwarder = CallBackFunction;
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
        GetCities = 6,
        ConnectVPN=7,
        DisConnectVPN=8

    }


0	CONNECTING	Socket has been created. The connection is not yet open.
1	OPEN	The connection is open and ready to communicate.
2	CLOSING	The connection is in the process of closing.
3	CLOSED
*/
