import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getWatchHistory, getRecommendedMovies } from '../services/movieService';
import MovieList from '../components/MovieList';

// A mock user ID. In a real app, you'd get this from your auth context.
const MOCK_USER_ID = 'user123';

const ProfilePage: React.FC = () => {
  const [watchHistory, setWatchHistory] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const history = await getWatchHistory(MOCK_USER_ID);
        setWatchHistory(history);
        
        if (history.length > 0) {
            const recommendations = await getRecommendedMovies(history);
            setRecommendedMovies(recommendations);
        }
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-white mb-8">My Profile</h1>
      <MovieList title="Watch History" movies={watchHistory} />
      {recommendedMovies.length > 0 && (
         <MovieList title="For You" movies={recommendedMovies} />
      )}
    </div>
  );
};

export default ProfilePage;