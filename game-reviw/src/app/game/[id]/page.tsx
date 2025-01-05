"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../utils/firebase";
import StarRating from "../../components/starRating";
import "@fortawesome/fontawesome-free/css/all.min.css";

const GameDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [game, setGame] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUserId(user ? user.uid : null);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchGameDetails = async () => {
      if (!id) return;
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

    fetchGameDetails();
  }, [id]);

  const toggleDescription = () => {
    setShowFullDescription((prev) => !prev);
  };

  if (loading) return <div className="text-center py-10 text-white">Loading...</div>;
  if (!game) return <div className="text-center py-10 text-white">Game not found.</div>;

  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-8 lg:px-24 py-8 sm:py-16 space-y-16">
      {/* HERO SECTION */}
      <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-xl">
        <img
          src={game.background_image}
          alt={game.name}
          className="w-full h-full object-cover object-top brightness-50"
        />
        <div className="absolute inset-0 flex flex-col justify-end items-start p-4 sm:p-8 md:p-12 bg-gradient-to-t from-black/80 to-transparent">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold">{game.name}</h1>
        </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-16 items-start">
        {/* LEFT COLUMN - GAME INFO */}
        <div className="flex flex-col justify-between bg-gray-800 p-4 sm:p-8 rounded-lg border border-gray-700 shadow-lg">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">{game.name}</h2>
            <p
              className={`text-sm sm:text-base leading-relaxed text-gray-300 mt-4 
                ${showFullDescription ? '' : 'line-clamp-3'} lg:line-clamp-none`}
            >
              {game.description_raw}
            </p>
            {/* Read More Button (Visible only on phones) */}
            <button
              onClick={toggleDescription}
              className="mt-2 text-blue-400 underline sm:hidden"
            >
              {showFullDescription ? "Show Less" : "Read More"}
            </button>
          </div>
          <div className="flex flex-wrap gap-4 mt-6">
            <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 sm:px-6 rounded-lg transition-all">
              <i className="fas fa-gamepad"></i> Played
            </button>
            <button className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white py-2 px-4 sm:px-6 rounded-lg transition-all">
              <i className="fas fa-thumbs-up"></i> Like
            </button>
            <button className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 sm:px-6 rounded-lg transition-all">
              <i className="fas fa-list"></i> Playlist
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-8 lg:flex-row items-stretch">
          {/* Stats and Rating */}
          <div className="flex flex-col gap-4 flex-1">
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg">
              <h3 className="text-lg sm:text-2xl font-semibold">Available Platforms</h3>
              <div className="flex flex-wrap gap-2 mt-4">
                {game.platforms?.map((p: any, index: number) => (
                  <span
                    key={index}
                    className="bg-blue-600 text-white px-2 sm:px-3 py-1 rounded-lg text-sm"
                  >
                    {p.platform.name}
                  </span>
                ))}
              </div>
            </div>
            {userId && (
              <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg text-center">
                <h3 className="text-lg sm:text-2xl font-semibold">Rate this Game</h3>
                <StarRating gameId={id as string} />
              </div>
            )}
            <div className="bg-gray-800 p-4 sm:p-6 rounded-lg border border-gray-700 shadow-lg text-center">
              <h3 className="text-lg sm:text-2xl font-semibold">Critic Rating</h3>
              <p className="text-yellow-400 text-2xl sm:text-4xl font-bold mt-2">
                {game.rating ? `${game.rating}/5` : "N/A"}
              </p>
            </div>
          </div>
          <img
            src={game.background_image}
            alt={game.name}
            className="w-full lg:w-[350px] h-auto object-cover rounded-lg border-2 border-gray-700 shadow-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default GameDetails;
