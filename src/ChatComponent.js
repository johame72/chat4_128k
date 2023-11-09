// src/ChatComponent.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ControlButtons from './ControlButtons';
import styles from './App.module.css';

const openai = axios.create({
  baseURL: 'https://api.openai.com/v1/',
  headers: {
    'Authorization': `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`
  }
});

const ChatComponent = () => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [timer, setTimer] = useState(0);
  const [isTiming, setIsTiming] = useState(false);
  const [responseTime, setResponseTime] = useState(null);

  useEffect(() => {
    let interval;
    if (isTiming) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    } else {
      clearInterval(interval);
      setTimer(0); // Reset timer
    }

    return () => clearInterval(interval);
  }, [isTiming]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && e.shiftKey) {
      e.preventDefault(); // Prevent default to avoid a new line being created by the textarea
      sendMessage(); // Call the send message function
    }
  };

  const sendMessage = async () => {
    setIsTiming(false); // Stop the timer if it was running
    setResponseTime(null); // Reset response time for new message
    const userMessage = inputValue;
    if (!userMessage.trim()) return;

    const updatedMessages = [...messages, { role: 'user', content: userMessage }];
    setMessages(updatedMessages);
    setInputValue('');
    setIsTiming(true); // Start timing

    try {
      const startTime = Date.now();
      const response = await openai.post('chat/completions', {
        model: 'gpt-4-1106-preview',
        messages: updatedMessages.map(msg => ({ role: msg.role, content: msg.content })),
      });
      const endTime = Date.now();
      const duration = (endTime - startTime) / 1000; // Calculate duration in seconds

      setResponseTime(duration); // Set response time
      setIsTiming(false); // Stop timing

      const assistantMessage = response.data.choices[0].message.content;
      if (assistantMessage) {
        setMessages(msgs => [...msgs, { role: 'assistant', content: assistantMessage }]);
      }
    } catch (error) {
      console.error("Error fetching chat completion:", error);
      setIsTiming(false); // Stop timing if there's an error
    }
  };

  const copyLastResponse = () => {
    const lastMessage = messages.find(msg => msg.role === 'assistant');
    if (lastMessage && navigator.clipboard) {
      navigator.clipboard.writeText(lastMessage.content);
    }
  };

  const clearConversation = () => {
    setMessages([]);
    setTimer(0); // Reset timer
    setIsTiming(false); // Ensure timing is stopped
    setResponseTime(null); // Reset response time
  };

  return (
    <div className={styles.chatComponent}>
      <ul className={styles.messageList}>
        {messages.map((msg, index) => (
          <li key={index} className={msg.role === 'user' ? styles.user : styles.assistant}>
            {msg.content}
          </li>
        ))}
      </ul>
      {isTiming && <p className={styles.timer}>Timing: {timer} seconds</p>}
      {responseTime !== null && <p className={styles.responseTime}>Response Time: {responseTime} seconds</p>}
      <form className={styles.messageForm} onSubmit={(e) => e.preventDefault()}>
        <textarea
          className={styles.messageInput}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message here and press SHIFT+ENTER to send..."
          autoFocus
          rows={3}
        />
        <button type="button" className={styles.sendButton} onClick={sendMessage}>Send</button>
      </form>
      <ControlButtons copyLastResponse={copyLastResponse} clearConversation={clearConversation} />
    </div>
  );
};

export default ChatComponent;
