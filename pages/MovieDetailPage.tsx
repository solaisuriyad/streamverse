import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types';
import { getMovieById, addToWatchHistory } from '../services/movieService';
import { useAuth } from '../AuthContext';

// This is the full, correct DownloadIcon component
const DownloadIcon: React.FC<{className: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm-9 13.5a.75.75 0 01.75.75v2.25a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5V16.5a.75.75 0 011.5 0v2.25a3 3 0 01-3 3H5.25a3 3 0 01-3-3V16.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
    </svg>
);

const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth(); // Get the real user
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const movieData = await getMovieById(id);
        setMovie(movieData || null);
      } catch (error) {
        console.error("Failed to fetch movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id]);

  // Add to watch history
  useEffect(() => {
    // Only add to history if we have a movie ID AND a logged-in user
    if (id && user) {
      addToWatchHistory(user.id, id);
    }
  }, [id, user]);

  if (loading) {
     return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  if (!movie) {
    return <div className="text-center text-2xl">Movie not found.</div>;
  }

  // This is the full, correct JSX for displaying the page
  return (
    <div className="animate-fade-in">
      <div className="relative -mx-4 -mt-8 h-[60vh] min-h-[400px]">
        <img src={movie.backdropUrl} alt="" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>

      <div className="relative -mt-48 container mx-auto px-4 pb-12">
        <div className="md:flex md:space-x-8">
          <div className="md:w-1/3 lg:w-1/4 flex-shrink-0">
            <img src={movie.posterUrl} alt={movie.title} className="rounded-lg shadow-2xl w-full" />
          </div>
          <div className="md:w-2/3 lg:w-3/4 mt-8 md:mt-12 text-white">
            <h1 className="text-4xl md:text-6xl font-bold">{movie.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-lg text-gray-400">
              <span>{movie.year}</span>
              <span>&bull;</span>
              <span className="flex items-center">
                <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                {movie.rating} / 10
              </span>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {movie.genres.map(genre => (
                <span key={genre} className="bg-gray-700 text-gray-300 text-sm font-semibold px-3 py-1 rounded-full">{genre}</span>
              ))}
            </div>
            <p className="mt-6 text-gray-300 leading-relaxed">{movie.synopsis}</p>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Watch Movie</h2>
        <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
          <video src={movie.streamUrl} controls className="w-full h-full" poster={movie.backdropUrl}>
            Your browser does not support the video tag.
          </video>
        </div>
      </div>

      <div className="mt-8 text-center">
        <a href={movie.streamUrl} download target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-500 text-white font-bold py-3 px-8 rounded-lg hover:bg-blue-600 transition-colors duration-300 shadow-lg">
            <DownloadIcon className="w-6 h-6" />
            Download
        </a>
      </div>
    </div>
  );
};

export default MovieDetailPage;