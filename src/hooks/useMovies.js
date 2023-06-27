/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useState } from 'react';

import { searchMovies } from '../services/movies';


export function userMovie({search}) {
  
  const [ movies, setMovies ] = useState( [] );
  const prevSearch = useRef(search)
  
  const getMovies = async () => {
    if ( search === prevSearch ) return;
    const newMovies = await searchMovies({search})
    setMovies(newMovies)
  }

  return {movies , getMovies}
}