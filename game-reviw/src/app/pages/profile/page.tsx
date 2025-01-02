"use client";
import React, { useState, useEffect } from "react";
import { auth, db } from "../../utils/firebase";
import { collection, doc, setDoc, getDocs, query } from "firebase/firestore";
import toast from "react-hot-toast";
import SearchBar from "../../components/searchBar";
import LibraryPage from "@/app/library/page";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  rating: number;
  platforms: string[];
}

const ProfilePage = () => {
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [isLoadingFavorites, setIsLoadingFavorites] = useState(true);

  const user = auth.currentUser;

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

    fetchFavoriteGames();
  }, [user]);

  const handleAddToFavorites = async (game: Game) => {
    if (!user) {
      toast.error("You need to be logged in to add a game to favorites.");
      return;
    }

    try {
      const favoritesRef = doc(db, "users", user.uid, "favorites", game.id.toString());
      await setDoc(favoritesRef, game);

      setFavoriteGames((prevGames) => [...prevGames, game]);
      toast.success(`${game.title} added to your favorites!`);
    } catch (error) {
      console.error("Error adding game to favorites:", error);
      toast.error("Failed to add game to favorites.");
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg font-semibold">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 sm:p-10">
      <header className="flex flex-col sm:flex-row items-center justify-between bg-gray-800 p-6 rounded-lg shadow-md mb-10">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-2xl font-bold uppercase">
            {user.displayName?.charAt(0) || user.email?.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{user.displayName || "User"}</h1>
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

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Your Favorite Games</h2>
        {isLoadingFavorites ? (
          <p>Loading your favorite games...</p>
        ) : favoriteGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {favoriteGames.map((game) => (
              <div key={game.id} className="bg-gray-800 p-4 rounded-lg shadow-md">
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="rounded-md mb-4 w-full h-48 object-cover"
                />
                <h3 className="text-lg font-semibold">{game.title}</h3>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">You have no favorite games. Start adding some!</p>
        )}
      </section>
      <section>
        <LibraryPage />
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-4">Search and Add Games</h2>
        <SearchBar onAddToFavorites={handleAddToFavorites} />
      </section>
    </div>
  );
};

export default ProfilePage;
