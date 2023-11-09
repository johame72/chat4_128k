import React from 'react';

const MessagesList = ({ messages }) => (
  <ul>
    {messages.map((msg, index) => (
      <li key={index} className={msg.role}>
        {msg.content}
      </li>
    ))}
  </ul>
);

export default MessagesList;