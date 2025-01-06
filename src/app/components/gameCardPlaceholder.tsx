const LoadingPlaceholder = () => {
    return (
      <div className="game-card bg-gray-800 rounded-lg overflow-hidden shadow-md flex flex-col relative animate-pulse">
        {/* Image Placeholder */}
        <div className="h-52 w-full bg-gray-700"></div>
  
        {/* Content Placeholder */}
        <div className="p-4 flex-grow space-y-3">
          {/* Title Placeholder */}
          <div className="h-6 bg-gray-700 rounded w-3/4"></div>
  
          {/* Rating Placeholder */}
          <div className="flex space-x-1">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-5 w-5 bg-gray-700 rounded"></div>
            ))}
          </div>
        </div>
  
        {/* Button Placeholder */}
        <div className="absolute bottom-4 right-4 w-10 h-10 bg-gray-700 rounded-full"></div>
      </div>
    );
  };
  
export default LoadingPlaceholder;
