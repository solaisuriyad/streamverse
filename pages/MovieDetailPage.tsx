import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Movie } from '../types';
import { getMovieById, addToWatchHistory } from '../services/movieService';
import { useAuth } from '../AuthContext'; // Import useAuth

// REMOVED: const MOCK_USER_ID = 'user123';

const DownloadIcon: React.FC<{className: string}> = ({ className }) => (
    // ... (no changes to this icon)
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
      addToWatchHistory(user.id, id); // Use the real user.id
    }
  }, [id, user]); // Re-run if the movie or the user changes

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

  return (
    <div className="animate-fade-in">
      {/* ... The rest of the page (the JSX) does not need to change ... */}
    </div>
  );
};

export default MovieDetailPage;