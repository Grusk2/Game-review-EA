"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import StarRating from "../../components/starRating";

const GameDetails = () => {
  const { id } = useParams();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null); // Authentication state
  const [showMore, setShowMore] = useState(false); // Toggle for platforms' visibility

  /** Auth state listener */
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Save authenticated user's ID
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  /** Fetch game details from RAWG API */
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

  if (loading) return <div>Loading...</div>;
  if (!game) return <div>Game not found.</div>;

  return (
    <div className="bg-gray-900 text-white px-5 md:px-20 py-6">
      {/* Hero Section */}
      <div className="relative">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-[400px] object-cover object-top rounded-lg"
        />
        <div className="absolute bottom-0 bg-gradient-to-t from-black to-transparent w-full p-4 rounded-lg">
          <h1 className="text-4xl font-bold">{game.name}</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row mt-8 gap-8">
        {/* Poster Section */}
        <div className="w-full md:w-1/4">
          <img
            src={game.background_image}
            alt={`${game.name} Poster`}
            className="w-full h-[350px] object-cover rounded-lg"
          />
        </div>

        {/* Details Section */}
        <div className="w-full md:w-2/4 flex flex-col pl-8 pr-8">
        <h2 className="text-2xl font-bold">{game.name}</h2>
          <p className="text-gray-300 mb-6 mt-6">{game.description_raw || "No description available."}</p>
        </div>

        {/* Right Column - Buttons and Stats */}
        <div className="w-full md:w-1/4 flex flex-col gap-4">
          {/* Star Rating for logged-in users */}
          {userId && (
            <div className="relative">
              <StarRating gameId={game.id} />
            </div>
          )}

          {/* Buttons */}
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">Watch</button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">Like</button>
          <button className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">Add to List</button>

          {/* Stats Section */}
          <div className="flex flex-col gap-4">
            {/* Platforms Section */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <strong>Platforms:</strong>
              <div
                className={`${
                  showMore ? "max-h-none" : "max-h-[100px]"
                } overflow-hidden`}
              >
                <p>
                  {game.platforms?.map((p: any) => p.platform.name).join(", ") || "No platforms available"}
                </p>
              </div>
              {!showMore && (
                <button
                  onClick={() => setShowMore(true)}
                  className="text-blue-400 hover:underline mt-2"
                >
                  Show More
                </button>
              )}
              {showMore && (
                <button
                  onClick={() => setShowMore(false)}
                  className="text-blue-400 hover:underline mt-2"
                >
                  Show Less
                </button>
              )}
            </div>

            {/* Rating Section */}
            <div className="bg-gray-800 p-4 rounded-lg">
              <strong>Critic Rating</strong>
              <p>{game.rating ? `${game.rating}/5` : "N/A"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
