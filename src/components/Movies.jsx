/* eslint-disable react/prop-types */
export const ListMovies = ({ movies }) => {
  return (
    <ol className="movies">
      {movies.map((movie) => (
        <li
          key={ movie.id }
          className="movie"
        >
          <img
            src={movie.poster !== 'N/A' ? movie.poster : '../../public/wizard.png '}
            alt={movie.title}
          />
          <h3>{ movie.title }</h3>
          <p>{ movie.type}</p>
          <p>{movie.year}</p>
        </li>
      ))}
    </ol>
  );
};

function NoResults({search}) {
  return <p>There are no results for your search &apos;{search}&apos; </p>;
}

export function Movies( { movies,search } ) {
  const hasMovies = movies?.length > 0;

  return (
    hasMovies
        ?
        <ListMovies
          movies={ movies }
        />
        :
      <NoResults
        search={search}
      />
      
  )
}
