"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Game } from "../utils/types";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Image from "next/image";

interface SearchBarProps {
    onAddToFavorites?: (game: Game) => void;
}

interface RawgSearchResult {
    id: number;
    name: string;
    background_image?: string;
    rating: number;
    platforms?: { platform: { name: string } }[];
}

const SearchBar: React.FC<SearchBarProps> = ({ onAddToFavorites }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [searchResults, setSearchResults] = useState<Game[]>([]);
    const [isDropdownVisible, setIsDropdownVisible] = useState(false);
    const router = useRouter();
    const searchBarRef = useRef<HTMLDivElement>(null);

    // ✅ Fixed: Memoized the search handler and added dependency to useEffect
    const handleSearch = useCallback(async () => {
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

            if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
                toast.error("No results found.");
                setSearchResults([]);
                return;
            }

            // ✅ Fixed: Replaced `any` with the proper type `RawgSearchResult`
            const results: Game[] = data.results.map((game: RawgSearchResult) => ({
                id: game.id,
                title: game.name,
                imageUrl: game.background_image || "/placeholder.jpg",
                rating: game.rating,
                platforms: game.platforms?.map((p) => p.platform.name) ?? [],
            }));

            setSearchResults(results);
        } catch (error) {
            console.error("Error fetching search results:", error);
            toast.error("Failed to fetch results. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    }, [searchQuery]);

    // ✅ Fixed: Added `handleSearch` as a dependency to avoid warnings
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
    }, [searchQuery, handleSearch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target as Node)) {
                setIsDropdownVisible(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                    aria-label="Search for a game"
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
                        ? Array.from({ length: 5 }).map((_, index) => <SkeletonLoader key={index} />)
                        : searchResults.map((game) => (
                              <div
                                  key={game.id}
                                  onClick={() => handleGameSelect(game.id)}
                                  className="flex items-center gap-4 p-4 hover:bg-gray-800 cursor-pointer rounded-lg transition-all duration-200"
                              >
                                  {/* ✅ Fixed: Replaced `<img>` with Next.js `<Image />` */}
                                  <Image
                                      src={game.imageUrl}
                                      alt={game.title}
                                      width={64}
                                      height={64}
                                      className="rounded-lg object-cover"
                                  />
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
