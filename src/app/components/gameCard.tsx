"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc, deleteDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faCheckCircle, faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

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
}: {
  game: Game;
  onAddToLibrary: (game: Game) => void;
}) {
  const [isClient, setIsClient] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [isAddedToLibrary, setIsAddedToLibrary] = useState(false);
  const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const handleAddGame = async (collectionName: "library" | "favorites") => {
    if (!auth.currentUser) {
      toast.error("You need to be logged in to add a game.");
      return;
    }

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
      collectionName === "library"
        ? setIsAddedToLibrary(true)
        : setIsAddedToFavorites(true);
    } catch (error) {
      console.error("Error adding game:", error);
      toast.error(`Failed to add to ${collectionName}.`);
    }
  };

  const handleRemoveGame = async (collectionName: "library" | "favorites") => {
    if (!auth.currentUser) {
      toast.error("You need to be logged in to remove a game.");
      return;
    }

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
      collectionName === "library"
        ? setIsAddedToLibrary(false)
        : setIsAddedToFavorites(false);
    } catch (error) {
      console.error("Error removing game:", error);
      toast.error(`Failed to remove from ${collectionName}`);
    }
  };

  return (
    <div className="game-card bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col relative">
      {/* Top Left Indicators for Library & Favorites */}
      <div className="absolute top-2 left-2 flex gap-2 z-10">
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

      {/* Three-dot menu for Actions */}
      <div className="absolute top-2 right-2 z-10" ref={dropdownRef}>
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="text-white text-lg focus:outline-none"
        >
          <FontAwesomeIcon icon={faEllipsisV} />
        </button>
        {menuOpen && (
          <div className="absolute right-0 mt-2 w-36 bg-gray-900 rounded-md shadow-lg z-20">
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

      {/* Game Content */}
      <Link href={`/game/${game.id}`}>
        <Image
          src={game.imageUrl}
          alt={game.title}
          width={400}
          height={300}
          objectFit="cover"
          className="w-full"
        />
        <div className="p-4">
          <h2 className="text-lg font-bold text-white">{game.title}</h2>
          <p className="text-sm text-green-400 font-semibold">
            {Array.from({ length: 5 }).map((_, i) => (
              <span
                key={i}
                className={`text-xl ${
                  i < (userRating ?? game.rating)
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              >
                ★
              </span>
            ))}
          </p>
        </div>
      </Link>
    </div>
  );
}

export default GameCard;
