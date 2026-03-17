import { use, useState } from 'react'
import Search from './components/Search'
import { useEffect } from 'react';
import {useDebounce} from 'react-use';


import './App.css'
import Spinner from './components/Spinner';
import { MovieCard } from './components/MovieCard';

function App() {
  const [searchTerm, setSearchTerm] = useState('');///searching

  const [errorMessage, setErrorMessage] = useState('');///error handling
  
  const[movieList, setMovieList] = useState([]); /// state to store the fetched movies 
  const [isLoading, setIsLoading] = useState(true); /// state to track loading status of the API request

  const [debouncedSearchTerm ,setDebouncedSearchTerm] = useState(''); ///debounced search term to prevent excessive API calls while the user is typing

  //top rated ..list and loading state
  const [topRatedMovies, setTopRatedMovies] = useState([]);
  const [isTopRatedLoading, setIsTopRatedLoading] = useState(true);

  

 // NEW: State to track if we are looking at movies or tv
  const [mediaType, setMediaType] = useState('movie');



  ////////debounce///////

  useDebounce(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 500, [searchTerm]); ///500-delay in ms , //searchTerm is dependency
  
  ///////////////////////


  ///API configuration /////
  const API_BASE_URL = 'https://api.themoviedb.org/3';
  const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
  const API_OPTIONS = {
    method: 'GET',
    headers: { 
      'accept': 'application/json',
      'Authorization': `Bearer ${API_KEY}`
    }
  };

  /////////////////////
 


  ///function to fetch movies from the API//////
  const fetchMovies = async (query='') => {

    setErrorMessage(''); /// Clear any previous error messages before fetching new movies
    setIsLoading(true); /// Set loading state to true when starting to fetch movies

    try {
       const endpoint = query 
        ?`${API_BASE_URL}/search/${mediaType}?query=${encodeURIComponent(query)}`
        : `${API_BASE_URL}/discover/${mediaType}?sort_by=popularity.desc`; /// if there is a search term, use the search endpoint, otherwise use the discover endpoint to get popular movies
       //////converted to utf-8 to make sure the query is processd properly 


       const response = await fetch(endpoint, API_OPTIONS);


       if (!response.ok) {
        throw new Error(`failed to fetch movies`);
      }

        const data = await response.json();
        if(data.Response === 'False') {

          setErrorMessage(data.Error || 'No movies found.'); ///someimes the API might return a response with an error message
          //, so we check for that and set it as the error message if it exists. Otherwise, we set a generic error message.

          setMovieList([]); /// Clear the movie list if there was an error fetching movies
          return;
         }

         setMovieList(data.results); /// if no error , update the movie list
     }

      catch (error) {
        console.error('Error fetching movies:', error);
        setErrorMessage('Failed to fetch movies. Please try again later.');
      }


      finally {
        setIsLoading(false); /// Set loading state to false after the API request is complete, regardless of success or failure
      }

    }
  ////////////////////////////


  ///////function to fetch top rated movies//////
  const fetchTopRatedMovies = async () => {
    setIsTopRatedLoading(true); /// Set loading state to true when starting to fetch top rated movies
  
    try {

      const endpoint = `${API_BASE_URL}/${mediaType}/top_rated`; /// endpoint to fetch top rated movies/tv shows

       const response = await fetch(endpoint, API_OPTIONS);


       if (!response.ok) {
        throw new Error(`failed to fetch movies`);
      }

        const movies = await response.json();
        if(movies.Response === 'False') {

          setErrorMessage(movies.Error || 'No movies found.'); ///someimes the API might return a response with an error message
          //, so we check for that and set it as the error message if it exists. Otherwise, we set a generic error message.

          setTopRatedMovies([]); /// Clear the movie list if there was an error fetching movies
          return;
         }

         setTopRatedMovies(movies.results); /// if no error , update the movie list
     }

      catch (error) {
        console.error('Error fetching movies:', error);
        setErrorMessage('Failed to fetch movies. Please try again later.');
      }


      finally {
        setIsTopRatedLoading(false); /// Set loading state to false after the API request is complete, regardless of success or failure
      }

    }
  ////////////////////////////



  ///useEffect to fetch movies when the component mounts//////
  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
                    }, [debouncedSearchTerm,mediaType]);

  ////////////////////////////////


  ///useEffect to fetch top rated when the component mounts//////
  useEffect(() => {
    fetchTopRatedMovies();
                    }, [mediaType]);

  ////////////////////////////////



  return (
    // The main wrapper handles the smooth blue-to-red color transition
    <main className={`min-h-screen relative transition-colors duration-700 ease-in-out ${mediaType === 'tv' ? 'theme-tv' : ''}`}>
      <div className='pattern'/>
      <div className='wrapper'>
        <header>

          <img src={mediaType === 'movie' ? './hero.png' : './hero-tv.png'} alt="Hero Banner" />
          
          {/* Dynamic Title Changes based on mediaType */}
          <h1>Find <span className="text-gradient">{mediaType === 'movie' ? 'Movies' : 'TV Shows'}</span> You'll Enjoy Without the Hassle</h1>
          
          {/* Explicit Toggle Buttons */}
          <div className="flex flex-row justify-center gap-5 mt-8 mb-4 bg-dark-100 p-2 rounded-xl max-w-fit mx-auto transition-colors duration-700 z-50 relative">
            <button 
              onClick={() => setMediaType('movie')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${mediaType === 'movie' ? 'bg-light-100/20 text-white shadow-sm' : 'text-gray-100 hover:text-white'}`}
            >
              Movies
            </button>
            <button 
              onClick={() => setMediaType('tv')}
              className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 ${mediaType === 'tv' ? 'bg-light-100/20 text-white shadow-sm' : 'text-gray-100 hover:text-white'}`}
            >
              TV Shows
            </button>
          </div>

          <Search 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm}
          mediaType={mediaType} /> 

        </header>

        {/* The Animated Wrapper: Changing the key forces React to replay the slide animation */}
        <div key={mediaType} className="animate-slide-in-right">
          
          {/* Only show Top Rated if there is NO search term */}
          {!searchTerm && (
            <section className='trending'>
              <h2>Top Rated {mediaType === 'movie' ? 'Movies' : 'TV Shows'}</h2>
              {isTopRatedLoading ? (
                <Spinner />
              ) : (
                <ul>
                  {topRatedMovies.map((movie, index) => (
                    <li key={movie.id}> 
                      <p>{index + 1}</p>
                      <img 
                        src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : '/no-movie.png'} 
                        alt={movie.title || movie.name} 
                      />
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className='all-movies'>
            <h2>All {mediaType === 'movie' ? 'Movies' : 'TV Shows'}</h2>
            {isLoading ? (
              <Spinner />
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ) : (
              <ul>
                {movieList.map((movie) => (
                 <MovieCard key={movie.id} movie={movie} />
                ))}
              </ul>
            )}
          </section>

        </div>
      </div>
    </main>
  )
}

export default App
