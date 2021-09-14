import { Movie } from './../domain/models/Movie';


interface OMDBMovieResponse {
    Poster: string;
    imdbRating: string;
}

export const getMovieDataFromOMDB = (movie: Movie):Promise<OMDBMovieResponse> => {

    const URL = 'https://www.omdbapi.com/';

    let title = movie.title.replace(' ', '+');

    let apiKey = process.env.REACT_APP_OMDB_API_KEY ?? '';
    
    return fetch(`${URL}?t=${title}&y=${movie.year}&apikey=${apiKey}`).then(movie => movie.json());
}