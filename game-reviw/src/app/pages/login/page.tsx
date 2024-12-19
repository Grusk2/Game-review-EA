"use client"
import { useState } from "react";
import { signIn } from "../../utils/auth";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      alert("Login Successful!");
    } catch (error) {
      console.error(error);
      alert("Failed to log in");
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto text-white"
    >
      {/* Email Input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
      {/* Password Input */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-3 mb-6 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-200 font-bold text-white"
      >
        Log In
      </button>
    </form>
  );
  
};

export default LoginPage;
