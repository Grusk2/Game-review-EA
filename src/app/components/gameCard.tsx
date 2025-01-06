"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCheckCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  rating: number;
  platforms: string[];
}

function GameCard({
  game,
  onAddToLibrary,
}: {
  game: Game;
  onAddToLibrary: (game: Game) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isAddedToLibrary, setIsAddedToLibrary] = useState(false);
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null); // ✅ Ref for dropdown

  useEffect(() => {
    setIsClient(true);
    const fetchUserRating = async () => {
      if (!auth.currentUser) return;
      try {
        const userRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "ratings",
          game.id.toString()
        );
        const userRatingDoc = await getDoc(userRef);
        if (userRatingDoc.exists()) {
          setUserRating(userRatingDoc.data()?.rating || null);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      }
    };

    fetchUserRating();
  }, [game.id]);

  useEffect(() => {
    const checkIfAdded = async () => {
      if (!auth.currentUser) return;
      try {
        const libraryRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "library",
          game.id.toString()
        );
        const favoritesRef = doc(
          db,
          "users",
          auth.currentUser.uid,
          "favorites",
          game.id.toString()
        );

        const [librarySnap, favoritesSnap] = await Promise.all([
          getDoc(libraryRef),
          getDoc(favoritesRef),
        ]);

        setIsAddedToLibrary(librarySnap.exists());
        setIsAddedToFavorites(favoritesSnap.exists());
      } catch (error) {
        console.error("Error checking if game is in library or favorites:", error);
      }
    };

    checkIfAdded();
  }, [game.id]);

  useEffect(() => {
    /** Detect clicks outside the dropdown to close it */
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  if (!isClient) {
    return null;
  }

  /** Add Game to Library or Favorites */
  const handleAddGame = async (collectionName: "library" | "favorites") => {
    if (!auth.currentUser) {
      toast.error("You need to be logged in to add a game.");
      return;
    }

    collectionName === "library"
      ? setIsAddedToLibrary(true)
      : setIsAddedToFavorites(true);

    try {
      const gameRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        collectionName,
        game.id.toString()
      );
      await setDoc(gameRef, game);
      toast.success(`${game.title} added to your ${collectionName}!`);
    } catch (error) {
      toast.error(`Failed to add to ${collectionName}.`);
      collectionName === "library"
        ? setIsAddedToLibrary(false)
        : setIsAddedToFavorites(false);
    }
  };

  /** Remove from Library or Favorites */
  const handleRemoveGame = async (collectionName: "library" | "favorites") => {
    if (!auth.currentUser) return;

    collectionName === "library"
      ? setIsAddedToLibrary(false)
      : setIsAddedToFavorites(false);

    try {
      const gameRef = doc(
        db,
        "users",
        auth.currentUser.uid,
        collectionName,
        game.id.toString()
      );
      await deleteDoc(gameRef);
      toast.success(`Removed from ${collectionName}`);
    } catch (error) {
      toast.error(`Failed to remove from ${collectionName}`);
      collectionName === "library"
        ? setIsAddedToLibrary(true)
        : setIsAddedToFavorites(true);
    }
  };

  return (
    <div className="game-card bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col relative">
      {/* Three-dot menu with ref for click outside */}
      <div className="absolute top-2 right-2 z-10" ref={dropdownRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-white text-lg focus:outline-none"
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-gray-900 rounded-md shadow-lg z-20">
            {/* Library Actions */}
            {isAddedToLibrary ? (
              <button
                onClick={() => handleRemoveGame("library")}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
              >
                Remove from Library
              </button>
            ) : (
              <button
                onClick={() => handleAddGame("library")}
                className="w-full text-left px-4 py-2 text-sm text-green-500 hover:bg-gray-700"
              >
                Add to Library
              </button>
            )}

            {/* Favorite Actions */}
            {isAddedToFavorites ? (
              <button
                onClick={() => handleRemoveGame("favorites")}
                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-700"
              >
                Remove from Favorites
              </button>
            ) : (
              <button
                onClick={() => handleAddGame("favorites")}
                className="w-full text-left px-4 py-2 text-sm text-yellow-500 hover:bg-gray-700"
              >
                Add to Favorites
              </button>
            )}
          </div>
        )}
      </div>

      {/* Card Content */}
      <Link href={`/game/${game.id}`}>
        <img
          src={game.imageUrl}
          alt={game.title}
          className="h-48 w-full object-cover object-top"
        />
        <div className="p-4 flex-grow">
          <h2 className="text-lg font-bold text-white mb-6 truncate">
            {game.title}
          </h2>
          <p className="text-sm text-green-400 font-semibold">
            {Array.from({ length: 5 }, (_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < (userRating ?? game.rating)
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              >
                {i < (userRating ?? game.rating) ? "★" : "★"}
              </span>
            ))}
          </p>
        </div>
      </Link>

      {/* Icons Based on Library and Favorite Status */}
      <div className="absolute top-2 left-2 flex gap-2">
        {isAddedToLibrary && (
          <FontAwesomeIcon
            icon={faCheckCircle}
            className="text-green-500 text-xl"
            title="In Library"
          />
        )}
        {isAddedToFavorites && (
          <FontAwesomeIcon
            icon={faStar}
            className="text-yellow-500 text-xl"
            title="Favorite"
          />
        )}
      </div>
    </div>
  );
}

export default GameCard;
