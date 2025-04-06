import { Flag } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { data, useNavigate } from 'react-router';

export default function LandingPage({ onJoinRoom, onCreateRoom }) {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roomId: ''
  });
  const [error, setError] = useState('');
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Name is required');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Valid email is required');
      return false;
    }
    if (!formData.roomId.trim()) {
      setError('Room ID is required');
      return false;
    }
    return true;
  };

  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      const url1 = `http://localhost:8080/api/validate/${formData.roomId}`;
      const url2 = `http://localhost:8080/api/create/${formData.roomId}`;
      try{
        const res1 = await(fetch(url1)); // Wait for the request
        const isRoom = await res1.json();// Wait for JSON conversion

        console.log("Is Room Present:", isRoom);

        if(isRoom===false){
          toast.error("No such room is present. Create the room");
          return;
        }

        // Create room...just to pass the roomid
        const res2 = await fetch(url2);
        console.log(await res2.json());

        const roomData = {
          "roomId" : formData.roomId,
          "user" : {
              "name" : formData.name,
              "email" : formData.email,
          }
        }
        
        navigate('/chat', { state: {roomData } });

      }catch(error){
        console.error("Error:", error);
            toast.error("Error connecting to server");
      }
    }
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    console.log(formData);
    if (validateForm()) {
      const url1 = `http://localhost:8080/api/validate/${formData.roomId}`;
      const url2 = `http://localhost:8080/api/create/${formData.roomId}`;
      try{
        const res1 = await(fetch(url1)); // Wait for the request
        const isRoom = await res1.json();// Wait for JSON conversion

        console.log("Is Room Present:", isRoom);

        if(isRoom===true){
          toast.error("Room is already present. Join the room to start conversation");
          return;
        }

        // Create room
        const res2 = await fetch(url2);
        console.log(await res2.json());

        const roomData = {
          "roomId" : formData.roomId,
          "user" : {
              "name" : formData.name,
              "email" : formData.email,
          }
        }
        
        navigate('/chat', { state: {roomData } });

      }catch(error){
        console.error("Error:", error);
            toast.error("Error connecting to server");
      }

    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 px-4 py-8 sm:px-6 md:px-8">
      <div className="m-auto w-full max-w-md">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-600 mb-4 sm:mb-6">Chat App</h1>
          
          <form className="space-y-4 sm:space-y-6">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded relative text-sm" role="alert">
                <span className="block sm:inline">{error}</span>
              </div>
            )}
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Your name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-1">Room ID</label>
              <input
                id="roomId"
                name="roomId"
                type="number"
                value={formData.roomId}
                onChange={handleChange}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm sm:text-base"
                placeholder="Enter room ID"
                required
              />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                onClick={handleJoinRoom}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition text-sm sm:text-base"
              >
                Join Room
              </button>
              <button
                type="button"
                onClick={handleCreateRoom}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition text-sm sm:text-base"
              >
                Create Room
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}