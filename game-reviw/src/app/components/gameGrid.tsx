"use client";

import React, { useState, useEffect } from "react";
import GameCard from "../components/gameCard";
import GameCardPlaceholder from "../components/gameCardPlaceholder";

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  platforms: string[];
  rating: number;
}

function GameGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games?key=3a05e794adaf449aa9c3e347c10065fb`
        );
        const data = await response.json();

        const formattedGames = data.results.map((game: any) => {
          return {
            id: game.id,
            title: game.name,
            imageUrl: game.background_image,
            description: game.description || "No description available",
            platforms: game.platforms.map((p: any) => p.platform.name),
            rating: game.rating,
          };
        });

        setGames(formattedGames);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching games:", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="game-card-grid grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pt-20">
      {isLoading ? (
        Array.from({ length: 15 }).map((_, index) => (
          <GameCardPlaceholder key={index} />
        ))
      ) : (
        games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))
      )}
    </div>
  );
}

export default GameGrid;
