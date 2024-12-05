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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Your Game Library</h1>
      {games.length === 0 ? (
        <p className="text-center text-gray-500">No games in your library yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}`}
              className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
            >
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="text-lg font-semibold mt-4">{game.title}</h3>
              <p className="text-gray-500 text-sm">{game.description}</p>
              <p className="mt-2 text-sm">
                <span className="font-semibold">Platforms:</span>{" "}
                {game.platforms.join(", ") || "Unknown"}
              </p>
              <p className="text-sm">
                <span className="font-semibold">Rating:</span> {game.rating}/10
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default LibraryPage;
