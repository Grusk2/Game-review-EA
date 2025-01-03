"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logOut, checkAuth } from "../utils/auth";
import SearchBar from "../components/searchBar";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchAuthState = async () => {
      const loggedIn = await checkAuth();
      setIsLoggedIn(loggedIn);
    };
    fetchAuthState();
  }, []);

  const handleLogout = async () => {
    await logOut();
    setIsLoggedIn(false);
    alert("Logged out!");
  };

  return (
    <header className="flex items-center justify-between bg-black text-white w-full px-6 md:px-20 h-16">
      {/* Left Section (Logo) */}
      <div>
        <Link href="/">
          <img src="/GameLens.png" alt="Logo" className="h-10 cursor-pointer" />
        </Link>
      </div>

      {/* Center Section (SearchBar) */}
      <div className="flex-1 flex justify-center">
        <SearchBar />
      </div>

      {/* Right Section (Auth Buttons or Profile Icon) */}
      <div className="flex items-center space-x-4">
        {!isLoggedIn ? (
          <>
            <Link href="/pages/login">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200">
                Log In
              </button>
            </Link>
            <Link href="/pages/signup">
              <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition duration-200">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <div className="relative">
            <div
              className="w-10 h-10 bg-white text-black flex items-center justify-center rounded-full cursor-pointer"
            >
            <Link href="/pages/profile">👤</Link>
              
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
