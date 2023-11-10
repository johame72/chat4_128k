// src\App.js
import React from 'react';
import styles from './App.module.css';
import ChatComponent from './ChatComponent';

function App() {
  return (
    <div className={styles.App}>
      <header className={styles.AppHeader}>
        <h1>OpenAI Chat 'gpt-4-1106-preview' 128k Tokens</h1>
        <ChatComponent />
      </header>
    </div>
  );
}

export default App;