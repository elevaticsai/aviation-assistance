import React, { useState } from 'react';
import { Plane, MessageSquare, X, Send, Smile, PaperclipIcon } from 'lucide-react';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
}

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How can I assist you with your travel plans today?",
      isUser: false,
      timestamp: "10:00 AM"
    }
  ]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    // Add user message
    const newMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputMessage }),
      });

      const data = await response.json();

      const aiMessage: Message = {
        text: data.response,
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        text: "I apologize, but I'm having trouble connecting to the server. Please try again later.",
        isUser: false,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Plane className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">SkyWings</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#" className="text-gray-700 hover:text-blue-600">Home</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Flights</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Services</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">About</a>
              <a href="#" className="text-gray-700 hover:text-blue-600">Contact</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0">
          <img
            className="w-full h-[600px] object-cover"
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80"
            alt="Airplane wing view"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-black/25"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Experience Luxury in the Sky
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl">
            Discover a new standard of air travel with SkyWings. Premium service, worldwide destinations, and unmatched comfort.
          </p>
          <button className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-colors">
            Book Your Flight
          </button>
        </div>
      </div>

      {/* AI Assistant Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        <MessageSquare className="h-6 w-6" />
      </button>

      {/* AI Assistant Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 bg-white rounded-2xl shadow-xl">
          <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-400 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-white p-2 rounded-full">
                <Plane className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-white font-semibold">SkyWings Assistant</h3>
                <p className="text-white/80 text-sm">Online</p>
              </div>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="text-white/80 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <div className="h-96 overflow-y-auto p-4 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-4 ${msg.isUser ? 'flex justify-end' : ''}`}
              >
                <div
                  className={`p-3 rounded-lg shadow-sm ${
                    msg.isUser
                      ? 'bg-blue-600 text-white ml-12'
                      : 'bg-white text-gray-800 mr-12'
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className={`text-xs mt-1 ${msg.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
                    {msg.timestamp}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <button className="text-gray-400 hover:text-gray-600">
                <Smile className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-gray-600">
                <PaperclipIcon className="h-6 w-6" />
              </button>
              <button 
                onClick={handleSendMessage}
                className={`bg-blue-600 text-white p-2 rounded-lg ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                }`}
                disabled={isLoading}
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;