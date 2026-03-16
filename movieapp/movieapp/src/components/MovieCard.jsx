import React from 'react'

export const MovieCard = ({ movie }) => {
  return (
     <p key={movie.id} className='text-white'>{movie.title}</p>
  )
}
