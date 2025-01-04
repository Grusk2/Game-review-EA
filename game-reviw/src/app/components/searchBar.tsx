"use client";

import React, { useState } from "react";
import { Game } from "../utils/types";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onAddToFavorites?: (game: Game) => void; 
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddToFavorites }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const router = useRouter();

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${searchQuery}`
      );
      const data = await response.json();
      const results = data.results.map((game: any): Game => ({
        id: game.id,
        title: game.name,
        imageUrl: game.background_image,
        rating: game.rating,
        platforms: game.platforms.map((p: any) => p.platform.name),
        description: "",
      }));
      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="relative w-full max-w-lg mx-auto py-4">
      {/* Search Input */}
      <div className="flex gap-2 items-center relative bg-gray-800 p-2 rounded-full shadow-lg">
        <input
          type="text"
          placeholder="Search for a game..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 text-white bg-transparent outline-none placeholder-gray-400"
        />
        {searchQuery && (
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-white transition"
          >
            ✕
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-full hover:scale-105 transform transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Dropdown Menu for Results */}
      {searchResults.length > 0 && (
        <div className="absolute z-50 w-full mt-4 bg-gray-900 bg-opacity-90 backdrop-blur-lg text-white rounded-lg shadow-lg max-h-80 overflow-y-auto border border-gray-700">
          {searchResults.map((game) => (
            <div
              key={game.id}
              onClick={() => router.push(`/game/${game.id}`)}
              className="flex items-center gap-4 p-4 hover:bg-gray-800 cursor-pointer rounded-lg transition-all duration-200"
            >
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <p className="text-sm text-gray-400">
                  {game.platforms.join(", ")}
                </p>
              </div>
              {/* Conditionally render "Add" button */}
              {onAddToFavorites && (
                <button
                  onClick={(e) => {
                    e.stopPropagation(); 
                    onAddToFavorites(game);
                  }}
                  className="px-4 py-2 bg-blue-600 rounded-full hover:bg-blue-500 transition-all"
                >
                  Add
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
