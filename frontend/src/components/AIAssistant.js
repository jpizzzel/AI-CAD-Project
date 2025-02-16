import React, { useState } from 'react';
import AIToggleButton from './AIchat';

const AIAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add the user's message to the chat
    const newMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, newMessage]);

    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: input })
      });
      const data = await response.json();
      
      // Add the AI's response to the chat
      setMessages((prev) => [...prev, { sender: 'bot', text: data.response }]);
    } catch (err) {
      console.error("Error contacting the AI:", err);
      setMessages((prev) => [...prev, { sender: 'bot', text: "Error contacting AI" }]);
    } finally {
      setIsLoading(false);
      setInput('');
    }
  };

  // If chat is closed, only show the toggle button
  if (!isOpen) {
    return <AIToggleButton isOpen={isOpen} onClick={() => setIsOpen(true)} />;
  }

  // Full chat interface when open
  return (
    <div className="fixed bottom-4 right-4 w-96 bg-[#222630] rounded-lg shadow-lg border-2 border-grey-500">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-100">CAD Assistant</h3>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-400 hover:text-gray-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="h-96 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-100'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="p-4 border-t border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about your CAD model..."
            className="flex-1 bg-gray-700 text-white rounded-lg px-4 py-2 outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isLoading ? '...' : 'Send'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AIAssistant; 