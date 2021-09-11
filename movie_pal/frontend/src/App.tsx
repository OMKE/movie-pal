import React, { useEffect, useState } from 'react';
import { Movie } from './domain/models/Movie';
import { Movies } from './pages/index/Movies';
import { getMovies } from './services/api_service';
import { Navbar } from './shared/Navbar/Navbar';
import { getMovieDataFromOMDB } from './util/api_util';





function App() {

  const [movies, setMovies] = useState<Movie[]>([])

  const [currentPage, setCurrentPage] = useState(1)

  const [size, setSize] = useState(20)

  const [total, setTotal] = useState(0);

  useEffect(() => {
    getMovies(size).then(moviesResponse => {
      // setMovies(moviesResponse.items);

      const prepareMovies = (movies: Movie[]) => {

        let moviesWithPosters = movies.map(movie => {
          let movieOmdb = getMovieDataFromOMDB(movie);
          movieOmdb.then(res => {
            movie.poster = res.Poster;
            movie.imdbRating = res.imdbRating;
            return movie;
          }).catch(err => console.log(err));
          return movie;
        });
        console.log(moviesWithPosters);
        setMovies(moviesWithPosters);
      }

      prepareMovies(moviesResponse.items);

      setCurrentPage(moviesResponse.page);
      setSize(moviesResponse.size);
      setTotal(moviesResponse.total);
    });
  }, [])


  return (
    <div>
      <Navbar></Navbar>
      <header className="bg-black shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">Movies</h1>
        </div>
      </header>
      <main className="bg-black">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Movies movies={movies} />
        </div>
      </main>
    </div>
  );
}

export default App;
