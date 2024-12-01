import React, { useState, useEffect } from 'react';

export const DashboardPage: React.FC = () => {
  const [messages, setMessages] = useState([
    { text: "Type your message below to start chatting.", sender: "bot" }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Function to start a conversation
  const startConversation = async () => {
    try {
      const response = await fetch('http://localhost:3000/start', { method: 'POST' });
      if (!response.ok) {
        console.error("Failed to start the conversation.");
      } else {
        setMessages([{ text: "Type your message below to start chatting.", sender: "bot" }]);
      }
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  // Automatically trigger /start when the page loads
  useEffect(() => {
    startConversation();
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    setMessages([...messages, { text: inputText, sender: "user" }]);
    const command = inputText.trim().toLowerCase();
    setInputText("");
    setIsTyping(true);

    if (command === '/stop') {
      // Call the stop endpoint and reinitialize the conversation
      try {
        const response = await fetch('http://localhost:3000/stop', { method: 'POST' });
        if (response.ok) {
          await startConversation(); // Reinitialize conversation
        } else {
          console.error("Failed to stop the conversation.");
        }
      } catch (error) {
        console.error("Error stopping conversation:", error);
      } finally {
        setIsTyping(false);
      }
    } else {
      // Send the message to the chat endpoint
      try {
        const response = await fetch('http://localhost:3000/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: inputText }),
        });

        const data = await response.json();
        setIsTyping(false);

        if (response.ok) {
          setMessages(prev => [...prev, { text: data.response, sender: "bot" }]);
        } else {
          setMessages(prev => [...prev, { text: "Error: " + data.error, sender: "bot" }]);
        }
      } catch (error) {
        console.error("Error during chat:", error);
        setIsTyping(false);
        setMessages(prev => [...prev, { text: "Failed to connect to the chat service.", sender: "bot" }]);
      }
    }
  };

  // Function to format message content: Bold text and line breaks
  const formatMessage = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = text.split(boldRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Bold text
        return (
          <strong key={index} className="font-bold">
            {part}
          </strong>
        );
      } else {
        // Handle line breaks
        return part.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < part.split('\n').length - 1 && <br />}
          </React.Fragment>
        ));
      }
    });
  };

  return (
    <div className="mt-10 md:mt-0 w-full h-full bg-gray-50 flex flex-col">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mx-2 ${message.sender === 'user' ? 'bg-blue-500' : 'bg-emerald-500'}`}>
                {message.sender === 'user' ? '👤' : '🤖'}
              </div>
              <div className={`rounded-2xl px-4 py-3 ${message.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}>
                <p className="text-sm sm:text-base">{formatMessage(message.text)}</p>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center">
              🤖
            </div>
            <div className="bg-gray-100 rounded-full px-4 py-2">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="w-full py-10 px-5">
        <div className="flex gap-4 max-w-6xl mx-auto">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
