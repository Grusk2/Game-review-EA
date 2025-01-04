"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../utils/firebase";
import { FirestoreGame } from "../utils/types";
import GameCard from "../components/gameCard";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";

export type Game = {
    id: number;
    title: string;
    imageUrl: string;
    description: string;
    platforms: string[];
    rating: number;
};

Chart.register(...registerables);

const LibraryPage = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        const fetchLibraryWithRatings = async (uid: string) => {
            console.log("🔎 Fetching library and ratings for user:", uid); 
            try {
                const libraryRef = collection(db, "users", uid, "library");
                const ratingsRef = collection(db, "users", uid, "ratings");

                const [librarySnapshot, ratingsSnapshot] = await Promise.all([
                    getDocs(libraryRef),
                    getDocs(ratingsRef),
                ]);

                console.log("📊 Library Snapshot Size:", librarySnapshot.size);
                console.log("📊 Ratings Snapshot Size:", ratingsSnapshot.size);

                if (librarySnapshot.empty) {
                    console.warn("⚠️ No games found in the library!");
                    setGames([]);
                    setLoading(false);
                    return;
                }

                // Create a map for ratings from the "ratings" collection
                const ratingsMap = new Map(
                    ratingsSnapshot.docs.map((doc) => [
                        Number(doc.id), 
                        doc.data().rating ?? 0
                    ])
                );

                console.log("🗺️ Ratings Map Created:", ratingsMap);

                // Merge data from both collections
                const mergedGames: Game[] = librarySnapshot.docs.map((docSnap) => {
                    const data = docSnap.data() as FirestoreGame;
                    const gameId = Number(docSnap.id);
                    return {
                        id: gameId,
                        title: data.title ?? "Untitled Game",
                        imageUrl: data.imageUrl ?? "/placeholder.png",
                        description: data.description ?? "No description available.",
                        platforms: data.platforms ?? ["Unknown"],
                        rating: ratingsMap.get(gameId) ?? 0,  // Merging rating from the map
                    };
                });

                console.log("✅ Final Merged Games Data:", mergedGames);
                setGames(mergedGames);
            } catch (error) {
                console.error("❌ Error fetching library games and ratings:", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchLibraryWithRatings(user.uid);
            } else {
                console.warn("⚠️ No user signed in.");
                setUserId(null);
                setGames([]);
                setLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    // Group games by rating
    const ratingCounts = {
        "5 Stars": games.filter((game) => game.rating === 5).length,
        "4 Stars": games.filter((game) => game.rating === 4).length,
        "3 Stars": games.filter((game) => game.rating === 3).length,
        "2 Stars": games.filter((game) => game.rating === 2).length,
        "1 Star": games.filter((game) => game.rating === 1).length,
        "Not Rated": games.filter((game) => game.rating === 0).length,
    };

    console.log("📊 Final Calculated Rating Counts:", ratingCounts);

    // Prepare data for the bar chart with adjusted settings
    const chartData = {
        labels: Object.keys(ratingCounts),
        datasets: [
            {
                label: "Number of Games",
                data: Object.values(ratingCounts),
                backgroundColor: [
                    "#4CAF50",
                    "#8BC34A",
                    "#FFC107",
                    "#FF9800",
                    "#F44336",
                    "#9E9E9E",
                ],
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
                suggestedMax: Math.max(...Object.values(ratingCounts)) + 2,  
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

            {/* Grouped Games by Rating with Dividers */}
            {Object.entries(ratingCounts).map(([rating, count], index) => (
                <section key={rating} className="mb-10">
                    <h3 className="text-2xl font-semibold mb-4">{rating}</h3>
                    
                    {/* Divider between sections */}
                    {index !== 0 && <hr className="border-t border-gray-600 my-6" />}
                    
                    {count > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {games
                                .filter((game) =>
                                    rating === "Not Rated"
                                        ? game.rating === 0
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
