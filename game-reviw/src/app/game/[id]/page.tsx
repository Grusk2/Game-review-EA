"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGameDetails = async () => {
      try {
        const response = await fetch(
          `https://api.rawg.io/api/games/${id}?key=${process.env.NEXT_PUBLIC_RAWG_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch game details.");
        }

        const data = await response.json();
        setGame(data);
      } catch (error) {
        console.error("Error fetching game details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchGameDetails();
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!game) {
    return <div>Game not found.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">{game.name}</h1>
      <img src={game.background_image} alt={game.name} className="w-full mt-4" />
      <p className="mt-4">{game.description_raw || "No description available."}</p>
      <div className="mt-4">
        <strong>Platforms:</strong> {game.platforms.map((p: any) => p.platform.name).join(", ")}
      </div>
      <div className="mt-2">
        <strong>Rating:</strong> {game.rating}
      </div>
    </div>
  );
};

export default GameDetails;
