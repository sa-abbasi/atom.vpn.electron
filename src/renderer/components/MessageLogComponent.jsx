import { observer } from 'mobx-react';
import React, { useState } from 'react';

const MessageLog = observer(({ messageStore }) => {
  const ClearMessage = () => {
    messageStore.clearStore();
  };

  return (
    <div
      className="mt-3 bg-black p-2"
      style={{
        color: 'white',
        height: 'auto',
        minHeight: '250px',
        maxHeight: '500px',
        overflowY: 'scroll',
      }}
    >
      <h4>Message Log</h4>
      <button
        type="button"
        className="btn btn-sm btn-danger"
        onClick={ClearMessage}
      >
        Clear Messages
      </button>
      {messageStore.messages.map((message, index) => (
        <div key={index} style={{ overflowWrap: 'anywhere' }}>
          {message.message}
        </div>
      ))}
    </div>
  );
});

export default MessageLog;
