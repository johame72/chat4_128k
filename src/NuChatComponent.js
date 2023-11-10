const startStreaming = async (messageContent) => {
    if (controller) return;
    const newController = new AbortController();
    setController(newController);
  
    try {
      const response = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: messageContent }],
            max_tokens: 1000,
            stream: true,
          }),
          signal: newController.signal,
        }
      );
  
      if (response.ok) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder('utf-8');
  
        let buffer = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
  
          let newlineIndex;
          while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);
  
            if (line === '[DONE]') {
              console.log('Stream finished');
              return; // Exit the function as the stream ended.
            }
  
            if (line.startsWith('data: ')) {
              const normalisedLine = line.substring(5);
              if (normalisedLine !== '[DONE]') {
                try {
                  const parsed = JSON.parse(normalisedLine);
                  // Use optional chaining and nullish coalescing to prevent errors
                  const messageContent =
                    parsed.choices[0]?.message?.content?.trim() ?? '';
                  if (messageContent) {
                    setMessages((msgs) => [
                      ...msgs,
                      { role: 'assistant', content: messageContent },
                    ]);
                  }
                } catch (e) {
                  console.error('Error parsing JSON:', e);
                }
              }
            }
          }
        }
      } else {
        const text = await response.text();
        console.error('Network response was not ok. Status:', response.status);
        console.error('Body:', text);
      }
    } catch (error) {
      console.error('There has been a problem with your fetch operation:', error);
    } finally {
      setController(null);
    }
  };
  