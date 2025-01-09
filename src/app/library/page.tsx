"use client";
import { useState, useEffect } from "react";
import { collection, onSnapshot } from "firebase/firestore";
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
    const [, setUserId] = useState<string | null>(null);

    useEffect(() => {
        let unsubscribeLibrary: () => void = () => {};
        let unsubscribeRatings: () => void = () => {};

        const fetchRealTimeLibrary = (uid: string) => {
            try {
                const libraryRef = collection(db, "users", uid, "library");
                const ratingsRef = collection(db, "users", uid, "ratings");

                let libraryGames: Game[] = [];

                // Fetch library and ensure proper structure
                unsubscribeLibrary = onSnapshot(libraryRef, (librarySnapshot) => {
                    libraryGames = librarySnapshot.docs.map((docSnap) => {
                        const data = docSnap.data() as FirestoreGame;
                        return {
                            id: Number(docSnap.id),
                            title: data.title ?? "Untitled Game",
                            imageUrl: data.imageUrl ?? "/placeholder.png",
                            description: data.description ?? "No description available.",
                            platforms: data.platforms ?? ["Unknown"],
                            rating: 0, 
                        };
                    });

                    setGames([...libraryGames]);
                });

                // Fetch ratings and merge into the existing games array
                unsubscribeRatings = onSnapshot(ratingsRef, (ratingsSnapshot) => {
                    const ratingsMap = new Map(
                        ratingsSnapshot.docs.map((doc) => [
                            Number(doc.id),
                            doc.data().rating ?? 0,
                        ])
                    );

                    // Update the games ensuring all fields exist
                    setGames((prevGames) =>
                        prevGames.map((game) => ({
                            ...game,
                            rating: ratingsMap.get(game.id) ?? game.rating,
                            title: game.title, // Ensure title persists
                            imageUrl: game.imageUrl,
                            description: game.description,
                            platforms: game.platforms,
                        }))
                    );
                });
            } catch (error) {
                console.error("❌ Error setting up real-time listeners:", error);
            } finally {
                setLoading(false);
            }
        };

        const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                fetchRealTimeLibrary(user.uid);
            } else {
                setUserId(null);
                setGames([]);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            unsubscribeLibrary();
            unsubscribeRatings();
        };
    }, []);

    // Grouping Logic Sorted from 5 Stars to Unrated
    const groupedGames = {
        "5 Stars": games.filter((game) => game.rating === 5),
        "4 Stars": games.filter((game) => game.rating === 4),
        "3 Stars": games.filter((game) => game.rating === 3),
        "2 Stars": games.filter((game) => game.rating === 2),
        "1 Star": games.filter((game) => game.rating === 1),
        "Not Rated": games.filter((game) => game.rating === 0),
    };

    // Bar Chart Data Preparation
    const ratingCounts = Object.fromEntries(
        Object.entries(groupedGames).map(([rating, games]) => [rating, games.length])
    );

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

            {/* Grouped Games Section - Proper Order */}
            {Object.entries(groupedGames).map(([rating, games]) => (
                <section key={rating} className="mb-10">
                    <h3 className="text-2xl font-semibold mb-4">{rating}</h3>
                    {games.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {games.map((game) => (
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
