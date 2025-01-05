"use client";

import { useState } from "react";
import { signUp } from "../../utils/auth";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(email, password);
      toast.success("Account created successfully! Please log in.");
      router.push("/pages/login"); // Redirecting user to login page after sign-up
    } catch (error) {
      console.error(error);
      toast.error("Failed to sign up. Please try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 px-4 sm:px-6 lg:px-8">
      <form
        onSubmit={handleSignUp}
        className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-lg text-white w-full max-w-sm md:max-w-md lg:max-w-lg"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-center mb-6">
          Create Your Account
        </h2>

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
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
        
        {/* Sign Up Button */}
        <button
          type="submit"
          className="w-full p-3 rounded-lg bg-green-500 hover:bg-green-600 transition duration-200 font-bold text-white"
        >
          Sign Up
        </button>

        {/* Redirect to Login */}
        <p className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a
            href="/pages/login"
            className="text-green-400 hover:underline cursor-pointer"
          >
            Log In
          </a>
        </p>
      </form>
    </div>
  );
};

export default SignUpPage;
