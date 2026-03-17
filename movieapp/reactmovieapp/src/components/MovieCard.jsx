import React from 'react'
// Inside MovieCard.jsx


export const MovieCard = ({ movie: { title, name, vote_average, poster_path, release_date, first_air_date, original_language } 
  }) => { //destructuring for better use
  
  
    // Fallbacks: If 'title' doesn't exist, use 'name'. Same for the dates.
    const displayTitle = title || name;
    const displayDate = release_date || first_air_date;
        
        return (
            <div className='movie-card'>

               <img 
                 src={poster_path ?

                    `https://image.tmdb.org/t/p/w500${poster_path}` :'/no-movie.png' }
                    alt={displayTitle}
                />

                <div className='mt-4'>

                    <h3>{displayTitle}</h3>

                    <div className='content'>

                        <div className='rating'>
                            <img src="star.svg" alt="Star Icon" />
                            <p>{vote_average? vote_average.toFixed(1) : 'N/A'}</p>
                        </div>

                        <span>•</span>
                        <p className='lang'>{original_language}</p>

                        <span>•</span>
                        <p className='year'>{displayDate? displayDate.split('-')[0] : 'N/A'}</p>
                        {/*  Extracting year from release date, if available, otherwise display 'N/A' */}
                        
                    </div>
                </div>
            </div>
        )
}
