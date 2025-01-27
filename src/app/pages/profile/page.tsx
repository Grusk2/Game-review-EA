"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../utils/firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import toast from "react-hot-toast";
import SearchBar from "../../components/searchBar";
import GameCard from "../../components/gameCard";
import { Game } from "../../utils/types";
import LibraryPage from "@/app/library/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons";

const ProfilePage = () => {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [user, setUser] = useState(auth.currentUser);
  const [isEditingName, setIsEditingName] = useState(false);
  const [newDisplayName, setNewDisplayName] = useState(user?.displayName || "");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        setNewDisplayName(user.displayName || "");
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchFavoriteGames = async () => {
      if (!user) return;

      try {
        const favoritesRef = collection(db, "users", user.uid, "favorites");
        const querySnapshot = await getDocs(query(favoritesRef));
        const games = querySnapshot.docs.map((doc) => doc.data() as Game);
        setFavoriteGames(games);
        setIsLoadingFavorites(false);
      } catch (error) {
        console.error("Error fetching favorite games:", error);
        setIsLoadingFavorites(false);
      }
    };

    if (user) {
      fetchFavoriteGames();
    }
  }, [user]);

  /** Save Updated Display Name */
  const handleUpdateDisplayName = async () => {
    if (!user || newDisplayName.trim() === "") {
      toast.error("Name cannot be empty.");
      return;
    }

    try {
      await updateProfile(user, { displayName: newDisplayName });
      setIsEditingName(false);
      toast.success("Display name updated successfully!");
    } catch (error) {
      console.error("Error updating display name:", error);
      toast.error("Failed to update display name.");
    }
  };

  /** Add to Favorites */
  const handleAddToFavorites = async (game: Game) => {
    if (!user) {
      toast.error("You need to be logged in to add a game to favorites.");
      return;
    }

    try {
      const favoritesRef = doc(
        db,
        "users",
        user.uid,
        "favorites",
        game.id.toString()
      );
      await setDoc(favoritesRef, game);
      setFavoriteGames((prevGames) => [...prevGames, game]);
      toast.success(`${game.title} added to your favorites!`);
    } catch (error) {
      console.error("Error adding game to favorites:", error);
      toast.error("Failed to add game to favorites.");
    }
  };


  /** Logout */
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg font-semibold">
          Please log in to view your profile.
        </p>
      </div>
    );
  }

  /** Return Section */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      {/* Profile Header Section */}
      <header className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 p-6 rounded-lg shadow-md mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
            {user.displayName?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div>
            {/* Name Section with Editable Input */}
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDisplayName}
                  onChange={(e) => setNewDisplayName(e.target.value)}
                  className="px-3 py-2 rounded-md bg-gray-700 text-white"
                />
                <button
                  onClick={handleUpdateDisplayName}
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-md"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold">
                  {user.displayName || "User"}
                </h1>
                {/* Pencil Icon for Editing */}
                <button
                  onClick={() => setIsEditingName(true)}
                  className="text-white hover:text-blue-400 transition"
                  aria-label="Edit Name"
                >
                  <FontAwesomeIcon icon={faPen} size="sm" />
                </button>
              </div>
            )}
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-0 px-4 py-2 bg-red-700 hover:bg-red-900 text-white rounded-md"
        >
          Log Out
        </button>
      </header>

      {/* Favorite Games Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Favorite Games</h2>
        </div>

        {isLoadingFavorites ? (
          <p>Loading your favorite games...</p>
        ) : favoriteGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteGames.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onAddToLibrary={handleAddToFavorites}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You have no favorite games yet.</p>
        )}
      </section>

      {/* Search Modal Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✕
            </button>
            <SearchBar onAddToFavorites={handleAddToFavorites} />
          </div>
        </div>
      )}

      {/* Library Section */}
      <LibraryPage />
    </div>
  );
};

export default ProfilePage;
