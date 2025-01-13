import React, { useState } from 'react';
import { Plane, MessageSquare, X, Send, Smile, PaperclipIcon } from 'lucide-react';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Message {
  text: string;
  isUser: boolean;
  timestamp: string;
  type?: 'text' | 'image' | 'video' | 'chart' | 'table';
  data?: any;
}

// Dummy data for charts
const barChartData = {
  labels: ['Economy', 'Business', 'First Class'],
  datasets: [{
    label: 'Passenger Distribution (%)',
    data: [70, 20, 10],
    backgroundColor: [
      'rgba(54, 162, 235, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
    ],
    borderColor: [
      'rgb(54, 162, 235)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
    ],
    borderWidth: 1
  }]
};

const pieChartData = {
  labels: ['Asia', 'Europe', 'Americas', 'Middle East', 'Africa'],
  datasets: [{
    data: [35, 25, 20, 15, 5],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
    ],
    borderColor: [
      'rgba(255, 99, 132, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
    ],
    borderWidth: 1
  }]
};

// Dummy data for table
const flightData = [
  { route: 'London - New York', frequency: 'Daily', price: '$499' },
  { route: 'Dubai - Singapore', frequency: '5x Weekly', price: '$399' },
  { route: 'Tokyo - Los Angeles', frequency: '3x Weekly', price: '$599' },
  { route: 'Paris - Hong Kong', frequency: '4x Weekly', price: '$649' },
];

function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      text: "Hello! How can I assist you with your travel plans today? Try commands: 'show images', 'show videos', 'show charts', or 'show tables'",
      isUser: false,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const handleSpecialCommands = (message: string): Message | null => {
    const command = message.toLowerCase().trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    switch (command) {
      case 'show images':
        return {
          text: "Here's an image of our Economy Class dining experience:",
          isUser: false,
          timestamp,
          type: 'image',
          data: 'https://c.ekstatic.net/ecl/photo-gallery/b777/economy-class/dining/emirates-b777-economy-class-dining-asian-customers-720x480.jpg?h=tSmbN0Hgu3cyAP9vt98aPw'
        };
      case 'show videos':
        return {
          text: "Here's a video about our services:",
          isUser: false,
          timestamp,
          type: 'video',
          data: 'MYsnMlaEcFI'
        };
      case 'show charts':
        return {
          text: "Here are our passenger statistics:",
          isUser: false,
          timestamp,
          type: 'chart',
          data: { bar: barChartData, pie: pieChartData }
        };
      case 'show tables':
        return {
          text: "Here are our popular flight routes:",
          isUser: false,
          timestamp,
          type: 'table',
          data: flightData
        };
      default:
        return null;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage: Message = {
      text: inputMessage,
      isUser: true,
      timestamp
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check for special commands first
    const specialResponse = handleSpecialCommands(inputMessage);
    if (specialResponse) {
      setMessages(prev => [...prev, specialResponse]);
      setIsLoading(false);
      return;
    }

    // Default response for non-special commands
    const defaultResponse: Message = {
      text: "I understand you're interested in our services. Try our special commands: 'show images', 'show videos', 'show charts', or 'show tables' to learn more about what we offer.",
      isUser: false,
      timestamp
    };
    setMessages(prev => [...prev, defaultResponse]);
    setIsLoading(false);
  };

  const renderMessageContent = (message: Message) => {
    if (!message) return null;

    switch (message.type) {
      case 'image':
        return message.data ? (
          <div className="my-2">
            <img 
              src={message.data} 
              alt="Travel content"
              className="w-full rounded-lg"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.onerror = null;
                target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80';
              }}
            />
          </div>
        ) : <p>Image not available</p>;

      case 'video':
        return message.data ? (
          <div className="my-2">
            <iframe
              width="100%"
              height="200"
              src={`https://www.youtube.com/embed/${message.data}`}
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg"
            ></iframe>
          </div>
        ) : <p>Video not available</p>;

      case 'chart':
        return message.data ? (
          <div className="space-y-4 my-2">
            <div className="bg-white p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Passenger Class Distribution</h4>
              <Bar data={message.data.bar} options={{ responsive: true }} />
            </div>
            <div className="bg-white p-4 rounded-lg">
              <h4 className="text-sm font-semibold mb-2">Destinations by Region</h4>
              <Pie data={message.data.pie} options={{ responsive: true }} />
            </div>
          </div>
        ) : <p>Charts not available</p>;

      case 'table':
        return message.data ? (
          <div className="my-2 overflow-x-auto">
            <table className="min-w-full bg-white rounded-lg">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Route</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Frequency</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {message.data.map((row: any, index: number) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm text-gray-900">{row.route}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{row.frequency}</td>
                    <td className="px-4 py-2 text-sm text-gray-900">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : <p>Table data not available</p>;

      default:
        return <p>{message.text || 'No message content'}</p>;
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
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80';
            }}
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
                  {renderMessageContent(msg)}
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