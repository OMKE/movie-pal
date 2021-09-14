import { randomInt } from 'crypto';
import React, { FunctionComponent, useEffect, useState } from 'react';
import { Movie } from '../../domain/models/Movie';
import { recommendMovies } from '../../services/api_service';
import Loader from 'react-loader-spinner';

export const RecommendMe: FunctionComponent<{}> = () => {
    const [recommendedMovies, setRecommendedMovies] = useState<Movie[]>([]);
    const pickedMovies = JSON.parse(localStorage.getItem('movies') || '{}');

    const [loadingMovies, setLoadingMovies] = useState(true);

    const [arePickedMovies, setArePickedMovies] = useState(
        pickedMovies.length ? true : false
    );

    useEffect(() => {
        if (arePickedMovies) {
            recommendMovies({
                movie_ids: pickedMovies.map(
                    (movie: Movie) => `${movie.movieId}`
                ),
            }).then((res) => {
                setLoadingMovies(false);
                setRecommendedMovies(res.data);
            });
        }
    }, []);

    return (
        <div className="bg-black min-h-screen">
            <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-white mb-3 pl-2">Recommended movies</h1>
                {!arePickedMovies && (
                    <h1 className="text-white text-center">
                        You have to pick movies first
                    </h1>
                )}
                {loadingMovies && pickedMovies && (
                    <div className="flex justify-center mt-10">
                        <Loader
                            type="Puff"
                            color="#E50914"
                            height={100}
                            width={100}
                        />
                    </div>
                )}
                <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                    {recommendedMovies.map((movie) => (
                        <a
                            key={movie.movieId + movie.title}
                            className="group movie-container"
                        >
                            <div className="bg-gray-200 rounded-lg overflow-hidden img-container relative">
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
            </div>
        </div>
    );
};
