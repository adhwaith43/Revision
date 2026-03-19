import { use, useState } from 'react'
import Search from './components/Search'
import { useEffect } from 'react';
import {useDebounce} from 'react-use';

import { useSelector, useDispatch } from 'react-redux';
import { setReduxMovieList, setReduxTopRatedMovies } from './store/movieSlice';

import './App.css'
import DetailPage from './components/DetailPage';
import Spinner from './components/Spinner';
import { MovieCard } from './components/MovieCard';



function App() {
  const [searchTerm, setSearchTerm] = useState('');///searching

  const [errorMessage, setErrorMessage] = useState('');///error handling
  
  /////const[movieList, setMovieList] = useState([]); /// state to store the fetched movies 


  const dispatch = useDispatch();
  // grab the movieList from state.movies /////
  const movieList = useSelector((state) => state.movies.movieList);


  const [isLoading, setIsLoading] = useState(true); /// state to track loading status of the API request

  const [debouncedSearchTerm ,setDebouncedSearchTerm] = useState(''); ///debounced search term to prevent excessive API calls while the user is typing
  
 // NEW: State to track if we are looking at movies or tv
  const [mediaType, setMediaType] = useState('movie');

  //top rated ..list and loading state
  const topRatedMovies = useSelector((state) => state.movies.topRatedMovies);

  const [showFavorites, setShowFavorites] = useState(false); ///variable to track whether we are showing favorites or not
  
  const favorites = useSelector((state) => state.movies.favorites); // NEW

  // NEW: Filter favorites based on the current toggle!
  const displayedFavorites = favorites.filter(fav => 
    mediaType === 'movie' ? fav.title !== undefined : fav.name !== undefined
  );


  const [isTopRatedLoading, setIsTopRatedLoading] = useState(true);


// Tracks the clicked movie/tv show //
  const [selectedItem, setSelectedItem] = useState(null); 

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

          // setMovieList([]); /// Clear the movie list if there was an error fetching movies

          dispatch(setReduxMovieList([])); // NEW REDUX WAY

          return;
         }

        //  setMovieList(data.results); /// if no error , update the movie list
        dispatch(setReduxMovieList(data.results)); // NEW REDUX WAY

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

          // setTopRatedMovies([]); /// Clear the movie list if there was an error fetching movies
          // return;
        dispatch(setReduxTopRatedMovies([])); // NEW REDUX WAY
        return;
         }

        //  setTopRatedMovies(movies.results); /// if no error , update the movie list
        dispatch(setReduxTopRatedMovies(movies.results)); // NEW REDUX WAY
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
      
      {/* NEW CHANGE: Replaced the plain <div className='pattern'/> with this dynamic background swapper */}
      <div className={`pattern transition-all duration-700 absolute inset-0 z-0 ${mediaType === 'tv' ? 'bg-[url("/hero-bg-tv.png")]' : ''}`} />

      {/* NEW CHANGE: Added relative positioning and z-index so content sits above the new background */}
      <div className='wrapper relative z-10 pt-10'>

        {/* NEW: Top Right Favorites Icon */}
        <button 
          onClick={() => {
            setShowFavorites(!showFavorites); // Toggle the page on/off
            setSelectedItem(null); // Make sure the detail page closes if it's open
          }}
          className={`absolute top-6 right-6 sm:top-10 sm:right-10 z-50 p-3 rounded-full transition-all duration-300 shadow-lg ${showFavorites ? 'bg-rose-500 text-white shadow-rose-500/30' : 'bg-dark-100/80 text-gray-100 hover:text-rose-400 hover:bg-dark-100'}`}
          title="My Favorites"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill={showFavorites ? "currentColor" : "none"} viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>
        


        {/* THE NEW 3-WAY LOGIC GATE */}
        {selectedItem ? (
          
          /* VIEW 1: Detail Page */
          <DetailPage 
            item={selectedItem} 
            mediaType={mediaType} 
            onBack={() => setSelectedItem(null)}
            onUpdate={setSelectedItem} /* NEW: This allows the DetailPage to update the local state when edited! */ 
          />
          
        ) : showFavorites ? (
          
          /* VIEW 2: The Dedicated Favorites Page */
          <div className="animate-delayed-fade mt-10">
            <h2 className="text-3xl font-bold text-white mb-8">
              My Favorite {mediaType === 'movie' ? 'Movies' : 'TV Shows'}
            </h2>
            
            {displayedFavorites.length > 0 ? (
              <section className="all-movies !mt-0">
                <ul>
                  {displayedFavorites.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} onCardselect={setSelectedItem} />
                  ))}
                </ul>
              </section>
            ) : (
              <div className="text-center py-20 bg-dark-100/30 rounded-3xl border border-light-100/5">
                <p className="text-gray-100 text-xl">You haven't added any favorite {mediaType === 'movie' ? 'movies' : 'TV shows'} yet.</p>
                <button onClick={() => setShowFavorites(false)} className="mt-6 text-blue-400 hover:text-blue-300 font-semibold underline">
                  Go find some!
                </button>
              </div>
            )}
          </div>

        ) : (

          /* VIEW 3: The Normal Home Page */

          <> {/* NEW CHANGE: React fragment wraps your original UI so it can exist inside the "else" part of the logic gate */}
            <header>

              {/* NEW CHANGE: Added a key so React knows to reload it, fixed the height/object-contain, and added the delayed fade animation */}
              <img 
                key={mediaType}
                src={mediaType === 'movie' ? './hero.png' : './hero-tv.png'} 
                alt="Hero Banner" 
                className="w-[400px] h-auto object-contain mx-auto drop-shadow-md animate-delayed-fade"
              />
              
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
                mediaType={mediaType} 
              /> 

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
                        // {/* NEW CHANGE: Made the Top Rated posters clickable to open the DetailPage */}
                        <li 
                          key={movie.id}
                          className="cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setSelectedItem(movie)}
                        > 
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
                    //  {/* NEW CHANGE: Passed onClick prop down to your MovieCard */}
                     <MovieCard key={movie.id} movie={movie} onCardselect={setSelectedItem} />
                    ))}
                  </ul>
                )}
              </section>


            </div>
          </>
        )}
      </div>
    </main>
  )
}

export default App