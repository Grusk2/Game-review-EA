"use client";

import React, { useState } from "react";
import { Game } from "../utils/types";
import { useRouter } from "next/navigation";

interface SearchBarProps {
  onSearch: (results: Game[]) => void;
  onCancelSearch: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onCancelSearch }) => {
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
        description: game.description || "No description available",
        platforms: game.platforms.map((p: any) => p.platform.name),
        rating: game.rating,
      }));
      setSearchResults(results);
      onSearch(results); // Pass results back to parent
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSearchQuery("");
    setSearchResults([]);
    onCancelSearch(); // Call parent cancel search
  };

  const handleResultClick = (gameId: number) => {
    router.push(`/game/${gameId}`); // Navigate to the game details page
    handleCancel(); // Clear search and reset
  };

  return (
    <div className="relative">
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search for a game..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 rounded-md bg-gray-800 text-white"
        />
        {searchQuery && (
          <button
            onClick={handleCancel}
            className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            ✕
          </button>
        )}
        <button
          onClick={handleSearch}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-500 disabled:opacity-50"
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>

      {/* Dropdown Menu for Results */}
      {searchResults.length > 0 && (
        <div className="absolute z-50 bg-gray-800 text-white rounded-md shadow-lg mt-2 w-full max-h-60 overflow-y-auto mb-10">
          {searchResults.map((game) => (
            <div
              key={game.id}
              className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
              onClick={() => handleResultClick(game.id)}
            >
              <img
                src={game.imageUrl}
                alt={game.title}
                className="w-16 h-16 rounded-md object-cover mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold">{game.title}</h3>
                <p className="text-sm text-gray-400">
                  {game.platforms.join(", ")}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
