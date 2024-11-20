"use client"
import React, { useState, useEffect } from 'react';
import GameCard from '../components/gameCard';
import GameCardPlaceholder from '../components/gameCardPlaceholder';

interface Game {
  id: number;
  title: string;
  imageUrl: string;
  description: string;
  // Add other properties as needed
}

function GameGrid() {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://your-api-endpoint');
        const data = await response.json();
        setGames(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching games:', error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="game-card-grid grid grid-cols-5 gap-4">
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