"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../utils/firebase";
import { Game } from "../utils/types";
import GameCard from "../components/gameCard";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

Chart.register(...registerables);

const LibraryPage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchLibrary = async (uid: string) => {
      try {
        const libraryRef = collection(db, "users", uid, "ratings");
        const snapshot = await getDocs(libraryRef);
        const libraryGames = snapshot.docs.map((docSnap) => {
          const gameData = docSnap.data() as Omit<Game, "id">; // ✅ Omit id from spread
          return {
            id: Number(docSnap.id), // ✅ Assigning ID only once
            ...gameData, // ✅ Spread without overwriting
          };
        });
        setGames(libraryGames);
      } catch (error) {
        console.error("Error fetching library games:", error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchLibrary(user.uid);
      } else {
        setUserId(null);
        setGames([]);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Grouping games by rating
  const ratingCounts = {
    "5 Stars": games.filter((game) => game.rating === 5).length,
    "4 Stars": games.filter((game) => game.rating === 4).length,
    "3 Stars": games.filter((game) => game.rating === 3).length,
    "2 Stars": games.filter((game) => game.rating === 2).length,
    "1 Star": games.filter((game) => game.rating === 1).length,
    "Not Rated": games.filter((game) => !game.rating).length,
  };

  // Prepare data for the bar chart
  const chartData = {
    labels: Object.keys(ratingCounts),
    datasets: [
      {
        label: "Number of Games",
        data: Object.values(ratingCounts),
        backgroundColor: ["#4CAF50", "#8BC34A", "#FFC107", "#FF9800", "#F44336", "#9E9E9E"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
      },
    },
  };

  if (loading) {
    return <p className="text-center text-gray-500 mt-4">Loading your library...</p>;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white p-6">
      <h2 className="text-3xl font-bold mb-8">Your Completed Games by Rating</h2>

      {/* Bar Chart Section */}
      <div className="mb-10 w-[50%] h-[250px]">
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Grouped Games by Rating */}
      {Object.entries(ratingCounts).map(([rating, count]) => (
        <section key={rating} className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">{rating}</h3>
          {count > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {games
                .filter((game) =>
                  rating === "Not Rated"
                    ? !game.rating
                    : game.rating === Number(rating.charAt(0))
                )
                .map((game) => (
                  <GameCard key={game.id} game={game} onAddToLibrary={() => {}} />
                ))}
            </div>
          ) : (
            <p className="text-gray-400">No games in this category.</p>
          )}
        </section>
      ))}
    </div>
  );
};

export default LibraryPage;
