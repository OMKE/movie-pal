import React, { FunctionComponent, useEffect, useState } from 'react';
import { Movie } from '../../domain/models/Movie';
import { getMovies } from '../../services/api_service';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/solid';
import Loader from 'react-loader-spinner';

export const Movies: FunctionComponent<{}> = () => {
    const [movies, setMovies] = useState<Movie[]>([]);

    const [currentPage, setCurrentPage] = useState<number>(1);

    const [size, setSize] = useState<number>(20);

    const [total, setTotal] = useState<number>(0);

    const [totalPages, setTotalPages] = useState<number>(0);

    const [loadingMovies, setLoadingMovies] = useState<boolean>(true);

    const [searchHasMovies, setSearchHasMovies] = useState<boolean>(true);

    useEffect(() => {
        getMoviesPerPage(currentPage, '', size);
    }, []);

    const getMoviesPerPage = (
        page: number,
        q: string = '',
        size: number = 20
    ) => {
        setLoadingMovies(true);
        setMovies([]);
        getMovies(size, page, q).then((moviesResponse) => {
            setSearchHasMovies(
                moviesResponse.items.length !== 0 ? true : false
            );
            setMovies(moviesResponse.items);
            setLoadingMovies(false);
            setCurrentPage(moviesResponse.page);
            setSize(moviesResponse.size);
            setTotal(moviesResponse.total);
            setTotalPages(
                Math.ceil(moviesResponse.total / moviesResponse.size)
            );
        });
    };

    // Check localStorage if key movie exists

    if (!localStorage.getItem('movies')) {
        localStorage.setItem('movies', JSON.stringify([]));
    }

    const handleClick = (e: any, id: number) => {
        let currentElement = e.currentTarget.classList.toggle(
            'movie-container-active'
        );
        toggleMovieFromLS(id);
    };

    const isMovieInLocalStorage = (movie: Movie) => {
        let moviesLocalStorage = JSON.parse(
            localStorage.getItem('movies') || '{}'
        );
        const res = moviesLocalStorage.filter(
            (movieLS: Movie) => movieLS.movieId === movie.movieId
        );
        return res.length > 0 ? true : false;
    };

    const toggleMovieFromLS = (movieId: number) => {
        let moviesLocalStorage = JSON.parse(
            localStorage.getItem('movies') || '{}'
        );

        // Check if movie exists
        const movieFromLS = moviesLocalStorage.filter(
            (movie: Movie) => movie.movieId === movieId
        );
        // Delete if exists, add otherwise
        if (movieFromLS.length === 0) {
            let movieToAdd = movies.filter(
                (movie: Movie) => movie.movieId === movieId
            )[0];
            addMovieToLocalStorage(movieToAdd);
        } else {
            let movieToDelete = movies.filter(
                (movie: Movie) => movie.movieId === movieId
            )[0];
            removeMovieFromLocalStorage(movieToDelete);
        }
    };

    const search = (event: any) => {
        const searchValue: string = event.target.value;
        if (searchValue.length >= 3) {
            getMoviesPerPage(1, searchValue);
        } else if (searchValue.length === 0) {
            setSearchHasMovies(true);
            getMoviesPerPage(currentPage);
        }
    };

    const addMovieToLocalStorage = (movie: Movie) => {
        let moviesLocalStorage = JSON.parse(
            localStorage.getItem('movies') || '{}'
        );
        moviesLocalStorage.push(movie);
        localStorage.setItem('movies', JSON.stringify(moviesLocalStorage));
    };

    const removeMovieFromLocalStorage = (movieToDelete: Movie) => {
        let moviesLocalStorage = JSON.parse(
            localStorage.getItem('movies') || '{}'
        );
        moviesLocalStorage = moviesLocalStorage.filter(
            (movie: Movie) => movie.movieId !== movieToDelete.movieId
        );
        localStorage.setItem('movies', JSON.stringify(moviesLocalStorage));
    };

    return (
        <div className="bg-black">
            <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-white mb-3">Movies</h1>

                <div className="pt-2 relative mx-auto text-gray-600 mb-10">
                    <input
                        className="border-0 bg-gray-900 w-full h-10 rounded-lg text-sm focus:outline-none pl-3"
                        type="search"
                        name="search"
                        placeholder="Search"
                        onChange={search}
                    />
                    <button
                        type="submit"
                        className="absolute right-0 top-0 mt-5 mr-4"
                    >
                        <svg
                            className="text-white h-4 w-4 fill-current"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            version="1.1"
                            id="Capa_1"
                            x="0px"
                            y="0px"
                            viewBox="0 0 56.966 56.966"
                            xmlSpace="preserve"
                            width="512px"
                            height="512px"
                        >
                            <path d="M55.146,51.887L41.588,37.786c3.486-4.144,5.396-9.358,5.396-14.786c0-12.682-10.318-23-23-23s-23,10.318-23,23  s10.318,23,23,23c4.761,0,9.298-1.436,13.177-4.162l13.661,14.208c0.571,0.593,1.339,0.92,2.162,0.92  c0.779,0,1.518-0.297,2.079-0.837C56.255,54.982,56.293,53.08,55.146,51.887z M23.984,6c9.374,0,17,7.626,17,17s-7.626,17-17,17  s-17-7.626-17-17S14.61,6,23.984,6z" />
                        </svg>
                    </button>
                </div>
                {loadingMovies && (
                    <div className="flex justify-center">
                        <Loader
                            type="Puff"
                            color="#E50914"
                            height={100}
                            width={100}
                        />
                    </div>
                )}
                {!searchHasMovies && (
                    <h1 className="text-white text-center">
                        No movies found 😔
                    </h1>
                )}
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {movies.map((movie) => (
                        <a
                            key={movie.movieId}
                            onClick={(e) => handleClick(e, movie.movieId)}
                            className={`group movie-container ${
                                isMovieInLocalStorage(movie)
                                    ? 'movie-container-active'
                                    : ''
                            }`}
                        >
                            <div className="bg-gray-200 relative rounded-lg overflow-hidden img-container">
                                <img
                                    src={movie.poster}
                                    alt={movie.title + ' movie poster'}
                                    className="w-full h-full object-center object-cover group-hover:opacity-75"
                                />
                                <p className="bg-black absolute right-3 bottom-5 px-2 py-1 rounded text-white">
                                    {movie.year}
                                </p>
                                <p className="bg-yellow-500 absolute left-3 bottom-5 px-2 py-1 rounded text-white">
                                    {movie.imdbRating}
                                </p>
                            </div>
                            <h3 className="mt-4 text-sm text-gray-500">
                                {movie.genres.map((genre) => `${genre} `)}
                            </h3>
                            <p className="mt-1 text-lg font-medium text-white">
                                {movie.title}
                            </p>
                        </a>
                    ))}
                </div>
                {/* Pagination */}
                {!loadingMovies && (
                    <div className="mt-10">
                        <div className="px-4 py-3 flex flex-wrap items-center justify-between border-t border-gray-800 sm:px-6">
                            <div className="flex-1 flex justify-between sm:hidden">
                                <a
                                    onClick={(e) =>
                                        currentPage !== 1 &&
                                        getMoviesPerPage(currentPage - 1)
                                    }
                                    className="relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-white bg-black hover:border-red-500 cursor-pointer"
                                >
                                    Previous
                                </a>
                                <a
                                    onClick={(e) =>
                                        currentPage !== totalPages &&
                                        getMoviesPerPage(currentPage + 1)
                                    }
                                    className="ml-3 relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md text-white bg-black hover:border-red-500 cursor-pointer"
                                >
                                    Next
                                </a>
                            </div>
                            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                                <div>
                                    <nav
                                        className="relative z-0 inline-flex flex-wrap rounded-md shadow-sm"
                                        aria-label="Pagination"
                                    >
                                        <a
                                            onClick={(e) =>
                                                currentPage !== 1 &&
                                                getMoviesPerPage(
                                                    currentPage - 1
                                                )
                                            }
                                            className="relative inline-flex items-center px-2 rounded-lg bg-black text-sm font-medium text-white border hover:border-red-600 hover:text-red-600 cursor-pointer"
                                        >
                                            <span className="sr-only">
                                                Previous
                                            </span>
                                            <ChevronLeftIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </a>
                                        {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}

                                        {Array.from(
                                            Array(totalPages),
                                            (e, i) => {
                                                return (
                                                    <a
                                                        onClick={(e) =>
                                                            getMoviesPerPage(
                                                                i + 1
                                                            )
                                                        }
                                                        key={i + 1}
                                                        aria-current="page"
                                                        className={`z-10 ${
                                                            i + 1 == currentPage
                                                                ? 'bg-red-600 hover:text-white'
                                                                : 'bg-grey-900 border border-grey-800 hover:text-red-600 '
                                                        } text-white relative inline-flex items-center px-4 py-2 text-sm font-medium cursor-pointer hover:border-red-600 rounded-lg m-1`}
                                                    >
                                                        {i + 1}
                                                    </a>
                                                );
                                            }
                                        )}
                                        <a
                                            onClick={(e) =>
                                                currentPage !== totalPages &&
                                                getMoviesPerPage(
                                                    currentPage + 1
                                                )
                                            }
                                            className="relative inline-flex items-center px-2 rounded-lg bg-black text-sm font-medium text-white border hover:border-red-600 cursor-pointer"
                                        >
                                            <span className="sr-only">
                                                Next
                                            </span>
                                            <ChevronRightIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                            />
                                        </a>
                                    </nav>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
