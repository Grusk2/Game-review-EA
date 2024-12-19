"use client"
import { useState } from "react";
import { signUp } from "../../utils/auth";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      alert("Sign-Up Successful!");
    } catch (error) {
      console.error(error);
      alert("Failed to sign up");
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="bg-gray-800 p-6 rounded-lg shadow-md max-w-md mx-auto text-white"
    >
      {/* Email Input */}
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      
      {/* Password Input */}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        className="w-full p-3 mb-6 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 transition duration-200 font-bold text-white"
      >
        Sign Up
      </button>
    </form>
  );
  
};

export default SignUpPage;
