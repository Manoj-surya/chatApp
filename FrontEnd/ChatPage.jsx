import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Copy, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export default function ChatRoom() {
    const navigate = useNavigate();
    const location = useLocation();
  // Default values to prevent undefined access
  const [roomId, setRoomId] = useState(location.state.roomData.roomId);
  const [currentUser, setCurrentUser] = useState({ name: "John Doe", email: "john@example.com" });
  useEffect(() => {
    if (location.state.roomData) {
        console.log("Received roomData:", location.state.roomData);
        setRoomId(location.state.roomData.roomId || "demo-room");
        setCurrentUser(location.state.roomData.user || { name: "John Doe", email: "john@example.com" });
    }
}, [location.state]); // Runs when roomData is updated
// console.log(roomId);
// console.log(currentUser);
  const [message, setMessage] = useState('');
  const [copied, setCopied] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const [messages, setMessages] = useState([
    // { id: 1, sender: { name: 'Alice Smith', email: 'alice@example.com' }, text: 'Hey everyone!', timestamp: new Date(Date.now() - 300000) },
    // { id: 2, sender: { name: 'John Doe', email: 'john@example.com' }, text: 'Hi Alice, how are you doing?', timestamp: new Date(Date.now() - 240000) },
    // { id: 3, sender: { name: 'Bob Johnson', email: 'bob@example.com' }, text: 'Hello guys, I just joined this room', timestamp: new Date(Date.now() - 180000) },
    // { id: 4, sender: { name: 'John Doe', email: 'john@example.com' }, text: 'Welcome Bob! We were just chatting about the new project', timestamp: new Date(Date.now() - 120000) },
    // { id: 5, sender: { name: 'Alice Smith', email: 'alice@example.com' }, text: 'Yes, we need to discuss the timeline', timestamp: new Date(Date.now() - 60000) }
  ]);
  
  const messagesEndRef = useRef(null);
 // In a real app, we would connect to a WebSocket here
  useEffect(() => {
    // Create a SockJS connection
    const socket = new SockJS('http://localhost:8080/ws'); // Replace with your WebSocket endpoint
    const client = new Client({
        webSocketFactory: () => socket,
        debug: (str) => console.log(str),
        reconnectDelay: 5000, // Reconnect after 5 seconds if disconnected
        onConnect: () => {
            console.log("Connected to WebSocket");
            client.subscribe(`/topic/${roomId}/messages`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages(receivedMessage);
            });
        },
        onDisconnect: () => {
            console.log("Disconnected from WebSocket");
        }
    });

    client.activate();
    setStompClient(client);

    return () => {
        if (client) client.deactivate();
    };
}, [roomId]);
  
  useEffect(() => {
    console.log(`Connected to room: ${roomId}`);
    
    return () => {
      console.log(`Disconnected from room: ${roomId}`);
    };
  }, [roomId]);

  //fetch initial messages

  useEffect(()=>{
    //fetch inital messages

    const fetchMessages = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/${roomId}/messages`);
            if (!response.ok) throw new Error("Failed to fetch messages");
            const data = await response.json();
            setMessages(data);
        } catch (error) {
            console.error("Error fetching messages:", error);
        }
    };
    fetchMessages();
  }, [roomId])  
  // Auto-scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    const newMessage = {
      sender: currentUser,
      text: message,
      timestamp: new Date()
    };
    stompClient.publish({ destination: `/app/chat/${roomId}`, body: JSON.stringify(newMessage) });
    console.log('Sending message:', newMessage);
    setMessage('');
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const handleBack = () => {
    navigate('/');
  };

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
    });
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header - Responsive */}
      <div className="bg-blue-600 text-white p-3 sm:p-4 flex items-center shadow-md justify-between">
      <div className="flex items-center">
      <button 
          onClick={handleBack}
          className="mr-2 sm:mr-3 rounded-full p-1 hover:bg-blue-700 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={20} className="sm:w-6 sm:h-6" />
        </button>
        <div className="overflow-hidden">
          <h1 className="text-lg sm:text-xl font-bold truncate">Room: {roomId}</h1>
          <p className="text-xs sm:text-sm text-blue-100 truncate">Logged in as {currentUser.name}</p>
        </div>
      </div>
      <button
          onClick={copyRoomId}
          className="ml-2 rounded-full p-2 hover:bg-blue-700 transition flex items-center justify-center"
          aria-label="Copy room ID"
          title="Copy room ID"
        >
          {copied ? (
            <Check size={18} className="sm:w-5 sm:h-5 text-green-300" />
          ) : (
            <Copy size={18} className="sm:w-5 sm:h-5" />
          )}
        </button>
      </div>
      
      {/* Messages Area - Responsive */}
      <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
        {messages.map((msg) => {
          const isCurrentUser = msg.sender.email === currentUser.email;
          
          return (
            <div 
              key={msg.id} 
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-xs sm:max-w-sm md:max-w-md rounded-lg p-2 sm:p-3 ${
                  isCurrentUser 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-gray-200 text-gray-800 rounded-bl-none'
                }`}
              >
                <div className="font-bold text-xs sm:text-sm">
                  {isCurrentUser ? 'You' : msg.sender.name}
                </div>
                <p className="text-sm sm:text-base break-words">{msg.text}</p>
                {/* <div className={`text-xs text-right mt-1 ${
                  isCurrentUser ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {formatTime(msg.timestamp)}
                </div> */}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message Input - Responsive */}
      <form onSubmit={handleSubmit} className="bg-white border-t border-gray-300 p-2 sm:p-4">
        <div className="flex items-center">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 border border-gray-300 rounded-l-md py-2 px-3 sm:px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Send message"
          >
            <Send size={18} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </form>
    </div>
  );
}