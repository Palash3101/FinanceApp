import React, { useState } from 'react';
import api from "../api";
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';

function UserForm({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Determine the title based on the method prop
  const name = method === "login" ? "Login" : "Register";

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true)

    try{
      const res = await api.post(route, {username, password})
      if (method==="login"){
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/");
      } else {
        navigate("/login");
      }

    }
    catch(error){
      console.error(error.response?.data)
      alert(error)
    }
    finally{
      setLoading(false)
    }

  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4 p-8 border border-gray-300 rounded-lg max-w-sm mx-auto mt-10 shadow-sm">
      <h1 className="text-2xl font-bold mb-4">{name}</h1>
      
      <input
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />

      <input
        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button 
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors disabled:bg-blue-300" 
        type="submit"
        disabled={loading}
      >
        {loading ? "Loading..." : name}
      </button>
    </form>
  );
}

export default UserForm;