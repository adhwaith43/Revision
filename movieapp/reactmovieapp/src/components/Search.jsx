import React from 'react'

const Search = ({ searchTerm, setSearchTerm , mediaType }) => { //{}-->destructuring props
  return (
    <div className="search">
      <div>
        <img src="search.svg" alt="search" />

        <input
          type="text"
          placeholder={`Search through thousands of ${mediaType === 'movie' ? 'movies' : 'TV shows'}`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  )
}
export default Search