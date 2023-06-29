/* eslint-disable react-hooks/rules-of-hooks */
import { useMemo, useRef, useState } from 'react';

import { searchMovies } from '../services/movies';


export function useMovie({search,sort}) {
  
  const [ movies, setMovies ] = useState( [] );
  const [ loading , setLoading] = useState( false );
  const [ error , setError] = useState( {} );
  const [ images , setImages] = useState( [] );
  const prevSearch = useRef(search )
  
  const getMovies = useMemo( () => {
    if ( search === prevSearch ) return;
    return async ({search}) => {
      try {
        setLoading( true );
        
        setError( null );
        const newMovies = await searchMovies( { search } )
        
        setMovies(newMovies)
      } catch (error) {
        setError(error.message);
      } finally {
         
        setLoading( false )
        
      }
    }
  },[] );
  const sortMovies = useMemo( () => {
    return (search === '') ? movies : sort === '1' ? [ ...movies ]?.sort( ( a, b ) => a.year - b.year ) : sort === '2' ? [ ...movies ]?.sort( ( a, b ) => a.title.localeCompare( b.title ) ) : movies;
  }, [sort, movies] );

  return {movies: sortMovies , getMovies,loading}
}