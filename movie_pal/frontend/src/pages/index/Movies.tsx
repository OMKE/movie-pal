import React, { FunctionComponent } from 'react';

import { Movie } from '../../domain/models/Movie';
import { getMovieDataFromOMDB } from '../../util/api_util';




export const Movies: FunctionComponent<{ movies: Movie[] }> = ({ movies = [] }) => {

    const handleClick = (id: number) => {
        console.log(id);
        // TODO - Add clicked movie to state above

        // Postaviti crvenu pozadinu oko filma koji je izabran
    }

    return (
        <div className="bg-black">
            <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="sr-only">Movies</h2>
                <div className="pt-2 relative mx-auto text-gray-600 mb-10">
                    <input className="border-0 bg-gray-900 w-full h-10 rounded-lg text-sm focus:outline-none"
                        type="search" name="search" placeholder="Search" />
                    <button type="submit" className="absolute right-0 top-0 mt-5 mr-4">
                        <svg className="text-white h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px"
                            viewBox="0 0 56.966 56.966" xmlSpace="preserve"
                            width="512px" height="512px">
                            <path
                                d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {movies.map((movie) => (
                        <a key={movie.movieId} onClick={(e) => handleClick(movie.movieId)} className="group relative">
                            <div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
                                <img
                                    src={movie.poster}
                                    alt={movie.title + ' movie poster'}
                                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                                />
                            </div>
                            <h3 className="mt-4 text-sm text-gray-500">{movie.genres.map(genre => `${genre} `)}</h3>
                            <p className="mt-1 text-lg font-medium text-white">{movie.title}</p>
                            <p className="bg-black absolute right-3 bottom-20 px-2 py-1 rounded text-white">{movie.year}</p>
                            <p className="bg-yellow-500 absolute left-3 bottom-20 px-2 py-1 rounded text-white">{movie.imdbRating}</p>
                        </a>
                    ))}
                </div>
            </div>
        </div>
    )
}