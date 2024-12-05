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
    <form onSubmit={handleSignUp}>
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default SignUpPage;
