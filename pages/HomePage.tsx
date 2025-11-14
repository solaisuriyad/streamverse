import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { getFeaturedMovies, getRecentlyWatched, getRecommendedMovies } from '../services/movieService';
import MovieList from '../components/MovieList';

const HomePage: React.FC = () => {
  const [featuredMovies, setFeaturedMovies] = useState<Movie[]>([]);
  const [recentlyWatched, setRecentlyWatched] = useState<Movie[]>([]);
  const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const [featured, recent] = await Promise.all([
          getFeaturedMovies(),
          getRecentlyWatched(),
        ]);
        setFeaturedMovies(featured);
        setRecentlyWatched(recent);

        if (recent.length > 0) {
          const recommendations = await getRecommendedMovies(recent);
          setRecommendedMovies(recommendations);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );
  }

  return (
    <div className="space-y-12">
      <section className="relative h-96 md:h-[500px] rounded-lg overflow-hidden -mt-8 -mx-4">
        <img src={featuredMovies[0]?.backdropUrl} alt={featuredMovies[0]?.title} className="w-full h-full object-cover"/>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-8 md:p-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">{featuredMovies[0]?.title}</h1>
          <p className="text-gray-200 mt-4 max-w-xl hidden md:block">{featuredMovies[0]?.synopsis}</p>
        </div>
      </section>

      <MovieList title="Featured Movies" movies={featuredMovies} />
      <MovieList title="Recently Watched" movies={recentlyWatched} />
      {recommendedMovies.length > 0 && (
        <MovieList title="Personalized Recommendations" movies={recommendedMovies} />
      )}
    </div>
  );
};

export default HomePage;