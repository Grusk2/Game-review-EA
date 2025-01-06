"use client";
import React, { useState, useEffect, useRef } from "react";
import { Game } from "../utils/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface SearchBarProps {
  onAddToFavorites?: (game: Game) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddToFavorites }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Game[]>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const router = useRouter();
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
        setIsDropdownVisible(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setIsDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /** Corrected Search Function with Defensive Check */
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setIsDropdownVisible(true);
    try {
      const encodedQuery = encodeURIComponent(searchQuery.trim().toLowerCase());
      const response = await fetch(
        `https://api.rawg.io/api/games?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}&search=${encodedQuery}`
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data. Status: ${response.status}`);
      }

      const data = await response.json();

      // Defensive check for missing or null results
      if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
        toast.error("No results found.");
        setSearchResults([]);
        return;
      }

      // Map results safely
      const results: Game[] = data.results.map((game: any) => ({
        id: game.id,
        title: game.name,
        imageUrl: game.background_image || null,
        rating: game.rating,
        platforms: game.platforms?.map((p: any) => p.platform.name) ?? [],
      }));

      setSearchResults(results);
    } catch (error) {
      console.error("Error fetching search results:", error);
      toast.error("Failed to fetch results. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsDropdownVisible(false);
  };

  const handleGameSelect = (gameId: number) => {
    router.push(`/game/${gameId}`);
    setIsDropdownVisible(false);
    setSearchQuery("");
  };

  /** Skeleton Loader for Loading State */
  const SkeletonLoader = () => (
    <div className="flex items-center gap-4 p-4 animate-pulse">
      <div className="w-16 h-16 bg-gray-700 rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  );

  return (
    <div ref={searchBarRef} className="relative w-full max-w-lg mx-auto py-4">
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
      </div>

      {/* Dropdown Menu */}
      {isDropdownVisible && (
        <div
          className="absolute z-50 w-full mt-4 bg-gray-900 bg-opacity-90 backdrop-blur-lg text-white rounded-lg shadow-lg max-h-80 overflow-y-auto border border-gray-700 scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-700 scrollbar-thumb-rounded-lg"
        >
          {isLoading
            ? Array.from({ length: 5 }).map((_, index) => (
                <SkeletonLoader key={index} />
              ))
            : searchResults.map((game: Game) => (
                <div
                  key={game.id}
                  onClick={() => handleGameSelect(game.id)}
                  className="flex items-center gap-4 p-4 hover:bg-gray-800 cursor-pointer rounded-lg transition-all duration-200"
                >
                  {/* Defensive check for empty image */}
                  {game.imageUrl ? (
                    <img
                      src={game.imageUrl}
                      alt={game.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-600 rounded-lg flex items-center justify-center text-sm">
                      No Image
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{game.title}</h3>
                    <p className="text-sm text-gray-400">
                      {game.platforms.join(", ") || "Unknown Platforms"}
                    </p>
                  </div>
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
