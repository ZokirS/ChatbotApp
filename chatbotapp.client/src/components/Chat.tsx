import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const Chat: React.FC = () => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Static welcome text
  const welcomeText = "Chatbot for RFA";

  // Auto-scroll ref
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // Auto-scroll whenever messages change
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user's message
    setMessages((prev) => [...prev, { role: 'user', content: userInput }]);
    setUserInput('');
    setIsLoading(true);

    try {
      // Call your API
      const response = await axios.post('/chat', { prompt: userInput });
      const aiReply = response.data?.text || 'No response';

      // Add AI's response
      setMessages((prev) => [...prev, { role: 'assistant', content: aiReply }]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Error: Something went wrong.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* Header Bar */}
      <div style={styles.headerBar}>
        <h1 style={styles.headerTitle}>{welcomeText}</h1>
      </div>

      {/* Chat Window */}
      <div style={styles.chatWindow} ref={chatWindowRef}>
        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={
              msg.role === 'user'
                ? { ...styles.messageBubble, ...styles.userBubble }
                : { ...styles.messageBubble, ...styles.aiBubble }
            }
          >
            <strong>{msg.role === 'user'}</strong> {msg.content}
          </div>
        ))}

        {isLoading && (
          <div style={{ ...styles.messageBubble, ...styles.aiBubble }}>
            <strong></strong> Thinking...
          </div>
        )}
      </div>

      {/* Input Bar */}
      <form onSubmit={handleSubmit} style={styles.inputBar}>
        <input
          type="text"
          style={styles.inputField}
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
        />
        <button type="submit" style={styles.sendButton} disabled={isLoading}>
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;

// -------------------- STYLES --------------------
const styles: Record<string, React.CSSProperties> = {
  pageWrapper: {
    display: 'flex',
    flexDirection: 'column',
    width: '200vh',
    height: '100vh',         // Fill the screen vertically
    margin: 0,               // Ensure no extra outer margin
    backgroundColor: '#1f1f1f'
  },
  headerBar: {
    backgroundColor: '#2c2c2c',
    padding: '1rem',
    textAlign: 'center'
  },
  headerTitle: {
    margin: 0,
    color: '#fff',
    fontSize: '1.25rem',
    fontWeight: 500
  },
  chatWindow: {
    flex: 1,                 // Occupy remaining space
    backgroundColor: '#ffffff',
    overflowY: 'auto',
    padding: '1rem'
  },
  messageBubble: {
    margin: '0.5rem 0',
    padding: '0.75rem 1rem',
    borderRadius: '8px',
    maxWidth: '75%',
    lineHeight: '1.4',
    fontSize: '1rem'
  },
  userBubble: {
    backgroundColor: '#007bff',
    color: '#fff',
    marginLeft: 'auto',
    textAlign: 'right'
  },
  aiBubble: {
    backgroundColor: '#e9ecef',
    color: '#333',
    marginRight: 'auto',
    textAlign: 'left'
  },
  inputBar: {
    display: 'flex',
    backgroundColor: '#333',
    padding: '0.75rem',
    alignItems: 'center'
  },
  inputField: {
    flex: 1,
    padding: '0.5rem',
    fontSize: '1rem',
    borderRadius: '4px 0 0 4px',
    border: '1px solid #444',
    outline: 'none',
    color: '#fff',
    backgroundColor: '#2c2c2c'
  },
  sendButton: {
    padding: '0.5rem 1rem',
    fontSize: '1rem',
    borderRadius: '0 4px 4px 0',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  }
};
