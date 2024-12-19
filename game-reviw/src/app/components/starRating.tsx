import { useState, useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../utils/firebase";

interface StarRatingProps {
  initialRating?: number;
  gameId: string;
}

const StarRating = ({ initialRating = 0, gameId }: StarRatingProps) => {
  const [rating, setRating] = useState(initialRating);
  const [hoverRating, setHoverRating] = useState(0);

  // Handle clicks on stars
  const handleClick = async (newRating: number) => {
    setRating(newRating);  // Set the rating locally

    if (auth.currentUser) {
      try {
        const userRef = doc(db, "users", auth.currentUser.uid, "ratings", gameId);
        await setDoc(userRef, { rating: newRating });  // Save the numeric rating
        console.log("Saved rating to Firebase:", newRating);
      } catch (error) {
        console.error("Error saving rating to Firebase:", error);
      }
    }
  };

  const handleMouseEnter = (hoverValue: number) => setHoverRating(hoverValue);
  const handleMouseLeave = () => setHoverRating(0);

  // Determine star type (empty, half, full)
  const getStarClass = (index: number) => {
    if (hoverRating) {
      if (hoverRating >= index + 0.5) return "full";
      if (hoverRating >= index) return "half";
    }

    if (rating) {
      if (rating >= index + 0.5) return "full";
      if (rating >= index) return "half";
    }

    return "empty";
  };

  return (
    <div className="flex items-center justify-center w-full h-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded">
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          className={`cursor-pointer text-4xl md:text-5xl transition duration-100 ease-in-out ${getStarClass(index) === "full"
            ? "text-yellow-400"
            : getStarClass(index) === "half"
            ? "text-yellow-300"
            : "text-gray-400"
            }`}
          onMouseEnter={() => handleMouseEnter(index + 0.5)}
          onMouseLeave={handleMouseLeave}
          onClick={() => handleClick(index + 0.5)} // Save as number, not as star character
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
