// src\MessageInput.js
import React from 'react';

const MessageInput = ({ inputValue, setInputValue, handleKeyDown }) => (
  <textarea
    value={inputValue}
    onChange={(e) => setInputValue(e.target.value)}
    onKeyDown={handleKeyDown}
    placeholder="Type your message here and press SHIFT+ENTER to send..."
    autoFocus
    rows={3}
  />
);

export default MessageInput;