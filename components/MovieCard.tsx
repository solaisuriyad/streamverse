import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
}

const StarIcon: React.FC<{ className: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.006z" clipRule="evenodd" />
    </svg>
);

const InfoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
    </svg>
);


const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isTooltipVisible, setTooltipVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hoverTimeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    hoverTimeoutRef.current = window.setTimeout(() => {
        setIsHovered(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
    }
    setIsHovered(false);
  };

  useEffect(() => {
    if (isHovered && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(error => {
        console.log("Autoplay was prevented: ", error);
      });
    } else if (videoRef.current) {
      videoRef.current.pause();
    }
  }, [isHovered]);

  return (
    <Link to={`/movie/${movie.id}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="group relative block bg-gray-800 rounded-lg overflow-hidden shadow-lg transform hover:scale-105 transition-transform duration-300">
      <div className="relative aspect-[2/3]">
        <img src={movie.posterUrl} alt={movie.title} className={`w-full h-full object-cover transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`} />
        {isHovered && (
            <video
              ref={videoRef}
              src={movie.trailerUrl}
              loop
              muted
              playsInline
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 p-3 w-full">
        <h3 className="text-white font-bold text-md truncate">{movie.title}</h3>
        <div className="flex justify-between items-center mt-1 text-gray-300 text-sm">
          <span>{movie.year}</span>
          <div className="flex items-center space-x-1">
            <StarIcon className="w-4 h-4 text-yellow-400"/>
            <span>{movie.rating}</span>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-40">
        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-white">
                <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.647c1.295.742 1.295 2.545 0 3.286L7.279 20.99c-1.25.717-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
            </svg>
        </div>
      </div>
        {movie.reason && (
            <div 
                className="absolute top-2 right-2 z-20"
                onMouseEnter={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTooltipVisible(true)}
                }
                onMouseLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setTooltipVisible(false)}
                }
            >
                <InfoIcon className="w-6 h-6 text-white bg-black bg-opacity-50 rounded-full p-1 cursor-pointer" />
                {isTooltipVisible && (
                    <div className="absolute bottom-full right-0 mb-2 w-48 bg-gray-700 text-white text-xs rounded py-2 px-3 shadow-lg z-30 transition-opacity duration-300 animate-fade-in-down">
                        <strong className='block text-sm mb-1'>For you because:</strong>
                        {movie.reason}
                    </div>
                )}
            </div>
        )}
    </Link>
  );
};

export default MovieCard;