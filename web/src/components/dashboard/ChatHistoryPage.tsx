import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export const ChatHistoryPage: React.FC = () => {
  const { fileName } = useParams<{ fileName: string }>();
  const [chatData, setChatData] = useState<{ role: string; content: string }[] | null>(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const response = await fetch(`http://localhost:3000/chat-files/${fileName}`);
        const data = await response.json();
        setChatData(data);
      } catch (error) {
        console.error('Error fetching chat history:', error);
      }
    };
    fetchChatHistory();
  }, [fileName]);

  if (!chatData) {
    return <div className="p-6">Loading chat history...</div>;
  }

  // Function to format messages: handle **bold** text and \n for line breaks
  const formatMessage = (content: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const parts = content.split(boldRegex);

    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // Bold part
        return (
          <strong key={index} className="font-bold">
            {part}
          </strong>
        );
      } else {
        // Replace \n with <br />
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
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {chatData.map((message, index) => (
          <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex items-start max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mx-2 ${
                  message.role === 'user' ? 'bg-blue-500' : 'bg-emerald-500'
                }`}
              >
                {message.role === 'user' ? '👤' : '🤖'}
              </div>
              <div
                className={`rounded-2xl px-4 py-3 ${
                  message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm sm:text-base">{formatMessage(message.content)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
