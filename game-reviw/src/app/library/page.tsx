"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../utils/firebase";
import Link from "next/link";

interface Game {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  platforms: string[];
  rating: number;
}

const LibraryPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async (uid: string) => {
      try {
        const libraryRef = collection(db, "users", uid, "library");
        const snapshot = await getDocs(libraryRef);
        const libraryGames = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Game[];
        setGames(libraryGames);
      } catch (error) {
        console.error("Error fetching library games:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchLibrary(user.uid);
      } else {
        setUserId(null);
        setGames([]);
        setLoading(false);
      }
    });

    return () => unsubscribe(); 
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-4">Loading your library...</p>;
  }

  if (!userId) {
    return (
      <p className="text-center text-gray-500 mt-4">
        Please log in to view your game library.
      </p>
    );
  }

  return (
    <div className="p-6 bg-gray-900 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8 text-white">
        Your Game Library
      </h1>
      {games.length === 0 ? (
        <p className="text-center text-gray-400">No games in your library yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {games.map((game) => (
            <div
              key={game.id}
              className="game-card bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col hover:shadow-lg transition-shadow duration-200"
            >
              <Link href={`/game/${game.id}`}>
                <img
                  src={game.imageUrl}
                  alt={game.title}
                  className="h-40 w-full object-cover"
                />
                <div className="p-4 flex-grow">
                  <h2 className="text-lg font-bold mb-2 text-white truncate">
                    {game.title}
                  </h2>
                  <p className="text-sm text-yellow-500 font-semibold">
                    <strong>Rating:</strong> {game.rating.toFixed(1)}
                  </p>
                  <p className="mt-2 text-sm text-gray-400">
                    <strong>Platforms:</strong>{" "}
                    {game.platforms.join(", ") || "Unknown"}
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
  
  
  
};

export default LibraryPage;
