"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logOut, checkAuth } from "../utils/auth";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const fetchAuthState = async () => {
      const loggedIn = await checkAuth(); // Replace with your auth check logic
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

      {/* Center Section (Navigation Links) */}
      <ul className="hidden md:flex gap-8">
        <li className="cursor-pointer hover:underline">
          <Link href="/discover">Discover</Link>
        </li>
        <li className="cursor-pointer hover:underline">
          <Link href="/library">Library</Link>
        </li>
      </ul>

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
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              👤
            </div>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg text-black">
                <ul className="py-2">
                  <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                    <Link href="/profile">Profile</Link>
                  </li>
                  <li
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={handleLogout}
                  >
                    Logout
                  </li>
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
