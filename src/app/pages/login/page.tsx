"use client";
import { useState } from "react";
import { signIn } from "../../utils/auth";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      toast.success("Login Successful!");

      // ✅ Using router.replace for a cleaner redirect
      router.replace("/");
    } catch (error) {
      console.error(error);
      toast.error("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleLogin}
        className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg text-white w-full max-w-sm md:max-w-md lg:max-w-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-4 sm:mb-6">
          Log In
        </h2>
        
        {/* Email Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full p-2 sm:p-3 mb-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        {/* Password Input */}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full p-2 sm:p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full p-2 sm:p-3 rounded-lg bg-blue-500 hover:bg-blue-600 transition duration-200 font-bold text-white"
        >
          Log In
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
