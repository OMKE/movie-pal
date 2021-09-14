import { FunctionComponent, useEffect, useState } from 'react';
import { Movie } from '../../domain/models/Movie';
import Loader from 'react-loader-spinner';
import { getRandom10s } from '../../services/api_service';

export const Random10s: FunctionComponent<{}> = () => {
    const [random10Movies, setRandom10Movies] = useState<Movie[]>([]);
    const [loadingMovies, setLoadingMovies] = useState(true);

    useEffect(() => {
        getRandom10s().then((res) => {
            setRandom10Movies(res);
            setLoadingMovies(false);
        });
    }, []);

    return (
        <div className="bg-black min-h-screen">
            <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <h1 className="text-white mb-3 pl-2">Random 10 movies</h1>
                {loadingMovies && (
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
                    {random10Movies.map((movie) => (
                        <a
                            key={movie.movieId}
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
