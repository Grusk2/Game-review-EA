import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";

interface StarRatingProps {
  gameId: string; // ID of the game to associate the rating with
}

const StarRating = ({ gameId }: StarRatingProps) => {
  const [rating, setRating] = useState<number | null>(null); // Store the current rating
  const [hoveredRating, setHoveredRating] = useState<number | null>(null); // Store the hovered rating

  // Fetch the rating from Firestore when the component mounts
  useEffect(() => {
    const fetchRating = async () => {
      if (auth.currentUser) {
        try {
          const userRef = doc(db, "users", auth.currentUser.uid, "ratings", gameId);
          const userRating = await getDoc(userRef);

          if (userRating.exists()) {
            setRating(userRating.data()?.rating || null); // Set rating from Firestore
          }
        } catch (error) {
          console.error("Error fetching rating from Firebase:", error);
        }
      }
    };

    fetchRating();
  }, [gameId]); // This will run every time the gameId changes

  const handleRating = async (newRating: number) => {
    setRating(newRating); // Update local state

    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid, "ratings", gameId);
        await setDoc(userRef, { rating: newRating }); // Save rating to Firestore
        console.log(`Rating of ${newRating} saved for game ${gameId}`);
      } catch (error) {
        console.error("Error saving rating to Firebase:", error);
      }
    } else {
      console.error("User not authenticated!");
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <p className="text-lg font-medium">Rate this Game</p>
      <div className="flex space-x-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            className={`px-4 py-2 rounded text-white ${
              (hoveredRating ?? rating) >= value
                ? "bg-yellow-500" // Filled star color
                : "bg-gray-700 hover:bg-gray-600" // Empty star color and hover effect
            }`}
            onClick={() => handleRating(value)}
            onMouseEnter={() => setHoveredRating(value)} // Hover effect
            onMouseLeave={() => setHoveredRating(null)} // Reset hover effect
          >
            &#9733; {/* Star character */}
          </button>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
