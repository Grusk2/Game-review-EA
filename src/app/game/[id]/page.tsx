"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../utils/firebase";
import { doc, getDoc, setDoc, deleteDoc } from "firebase/firestore";
import StarRating from "../../components/starRating";
import toast from "react-hot-toast";
import Image from "next/image";
import "@fortawesome/fontawesome-free/css/all.min.css";

interface RawgGameDetails {
    id: number;
    name: string;
    background_image?: string;
    description_raw?: string;
    rating?: number;
    platforms?: { platform: { name: string } }[];
}

const GameDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [game, setGame] = useState<RawgGameDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isAddedToLibrary, setIsAddedToLibrary] = useState(false);
    const [isAddedToFavorites, setIsAddedToFavorites] = useState(false);

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

                const data: RawgGameDetails = await response.json();
                setGame(data);

                if (userId) {
                    const libraryRef = doc(db, "users", userId, "library", id);
                    const favoritesRef = doc(db, "users", userId, "favorites", id);
                    const [librarySnap, favoritesSnap] = await Promise.all([
                        getDoc(libraryRef),
                        getDoc(favoritesRef),
                    ]);
                    setIsAddedToLibrary(librarySnap.exists());
                    setIsAddedToFavorites(favoritesSnap.exists());
                }
            } catch (error) {
                console.error("Error fetching game details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGameDetails();
    }, [id, userId]);

    const toggleDescription = () => {
        setShowFullDescription((prev) => !prev);
    };

    const handleAddGame = async (collectionName: "library" | "favorites") => {
        if (!userId || !game) {
            toast.error("You need to be logged in to add a game.");
            return;
        }

        try {
            const gameRef = doc(db, "users", userId, collectionName, id);
            await setDoc(gameRef, game);
            collectionName === "library"
                ? setIsAddedToLibrary(true)
                : setIsAddedToFavorites(true);
            toast.success(`${game.name} added to ${collectionName}!`);
        } catch (error) {
            console.error("Error adding game:", error);
            toast.error(`Failed to add to ${collectionName}.`);
        }
    };

    const handleRemoveGame = async (collectionName: "library" | "favorites") => {
        if (!userId) return;

        try {
            const gameRef = doc(db, "users", userId, collectionName, id);
            await deleteDoc(gameRef);
            collectionName === "library"
                ? setIsAddedToLibrary(false)
                : setIsAddedToFavorites(false);
            toast.success(`Removed from ${collectionName}`);
        } catch (error) {
            console.error("Error removing game:", error);
            toast.error(`Failed to remove from ${collectionName}`);
        }
    };

    if (loading) return <div className="text-center py-10 text-white">Loading...</div>;
    if (!game) return <div className="text-center py-10 text-white">Game not found.</div>;

    return (
        <div className="min-h-screen bg-gray-950 text-white px-4 sm:px-8 lg:px-24 py-8 sm:py-16 space-y-16">
            {/* HERO SECTION */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[600px] rounded-lg overflow-hidden shadow-xl">
                <Image
                    src={game.background_image || "/placeholder.jpg"}
                    alt={game.name}
                    layout="fill"
                    objectFit="cover"
                    className="brightness-50"
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
                            className={`text-sm sm:text-base leading-relaxed text-gray-300 mt-4 ${
                                showFullDescription ? "" : "line-clamp-3"
                            } lg:line-clamp-none`}
                        >
                            {game.description_raw}
                        </p>
                        <button
                            onClick={toggleDescription}
                            className="mt-2 text-blue-400 underline sm:hidden"
                        >
                            {showFullDescription ? "Show Less" : "Read More"}
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
                                {game.platforms?.map((p, index) => (
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
                </div>
            </div>
        </div>
    );
};

export default GameDetails;
