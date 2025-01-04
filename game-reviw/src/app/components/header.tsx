"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { logOut, checkAuth } from "../utils/auth";
import { auth } from "../utils/firebase";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import SearchBar from "../components/searchBar";

const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [newDisplayName, setNewDisplayName] = useState(
    user?.displayName || user?.email || "User"
  );

  useEffect(() => {
    const fetchAuthState = async () => {
      const loggedIn = await checkAuth();
      setIsLoggedIn(loggedIn);
      setUser(auth.currentUser);
      setNewDisplayName(
        auth.currentUser?.displayName || auth.currentUser?.email || "User"
      );
    };
    fetchAuthState();
  }, []);

  /** ✅ Save Updated Display Name */
  const handleUpdateDisplayName = async (newName: string) => {
    if (!user || newName.trim() === "") {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      await updateProfile(user, { displayName: newName });
      setNewDisplayName(newName);
      setDropdownOpen(false); // Close dropdown after updating name
      toast.success("Display name updated successfully!");
    } catch (error) {
      console.error("Error updating display name:", error);
      toast.error("Failed to update display name.");
    }
  };

  /** ✅ Logout */
  const handleLogout = async () => {
    await logOut();
    setIsLoggedIn(false);
    setDropdownOpen(false); // Close dropdown after logout
    toast.success("Logged out successfully!");
  };

  return (
    <header className="flex items-center justify-between bg-black text-white w-full px-6 md:px-20 h-18 relative z-50">
      {/* Left Section (Logo) */}
      <div>
        <Link href="/">
          <img src="/GameLens.png" alt="Logo" className="h-12 cursor-pointer" />
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
          <div className="relative z-50">
            {/* Profile Picture Button */}
            <div
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-12 h-12 bg-blue-500 text-white flex items-center justify-center rounded-full cursor-pointer text-lg font-bold"
            >
              {newDisplayName?.charAt(0).toUpperCase()}
            </div>

            {/* Dropdown Content */}
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg overflow-hidden z-50">
                <p className="px-4 py-2 font-semibold">{newDisplayName}</p>
                <Link href="/pages/profile">
                  <p
                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                    onClick={() => setDropdownOpen(false)} // Close on click
                  >
                    View Profile
                  </p>
                </Link>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-red-500 hover:bg-gray-700 w-full text-left"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
