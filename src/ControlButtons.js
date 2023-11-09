// src/ControlButtons.js

import React from 'react';
import styles from './App.module.css';

const ControlButtons = ({ copyLastResponse, clearConversation }) => (
  <div className="button-container">
    <button onClick={copyLastResponse}>Copy</button>
    <button onClick={clearConversation}>Clear Conversation</button>
  </div>
);

export default ControlButtons;