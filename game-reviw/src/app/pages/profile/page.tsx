"use client";

import React, { useState, useEffect } from "react";
import { auth, db } from "../../utils/firebase";
import {
  collection,
  doc,
  setDoc,
  getDocs,
  deleteDoc,
  query,
} from "firebase/firestore";
import toast from "react-hot-toast";
import SearchBar from "../../components/searchBar";
import GameCard from "../../components/gameCard";
import { Game } from "../../utils/types";
import LibraryPage from "@/app/library/page";

const ProfilePage = () => {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // For the popup modal
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
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

  /** ✅ Add to Favorites */
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

  /** ✅ Remove from Favorites (Instant Deletion) */
  const handleRemoveFromFavorites = async (gameId: string) => {
    if (!user) return;
    try {
      const favoriteRef = doc(db, "users", user.uid, "favorites", gameId.toString());
      await deleteDoc(favoriteRef);
      setFavoriteGames((prevGames) =>
        prevGames.filter((game) => game.id.toString() !== gameId)
      );
      toast.success("Game removed from favorites.");
    } catch (error) {
      console.error("Error removing game from favorites:", error);
      toast.error("Failed to remove game.");
    }
  };

  /** ✅ Logout */
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

  /** ✅ Return Section - No Tabs, Everything Simplified */
  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      {/* Profile Header */}
      <header className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 p-6 rounded-lg shadow-md mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
            {user.displayName?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">
              {user.displayName || "User"}
            </h1>
            <p className="text-gray-400">{user.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 sm:mt-0 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md"
        >
          Log Out
        </button>
      </header>

      {/* ✅ Favorite Games Section */}
      <section className="mb-10">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Your Favorite Games</h2>
          {/* Add Game Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500"
          >
            + Add Game
          </button>
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
          <p className="text-gray-400">You have no favorite games. Start adding some!</p>
        )}
      </section>

      {/* ✅ Search Modal Popup */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="absolute top-4 right-4 text-white text-xl"
            >
              ✕
            </button>
            <SearchBar />
          </div>
        </div>
      )}

      {/* ✅ Library Section */}
      <LibraryPage />
    </div>
  );
};

export default ProfilePage;
