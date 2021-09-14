import { Movie } from './../domain/models/Movie';
import axios from 'axios';

const API_VERSION = process.env.REACT_APP_API_VERSION;
const APP_DOMAIN = process.env.REACT_APP_APP_DOMAIN;

const getUrl = (path: string) => {
    return `${APP_DOMAIN}/api/${API_VERSION}/${path}`;
};

interface MoviesResponse {
    items: Movie[];
    total: number;
    size: number;
    page: number;
}

interface RecommendMeRequest {
    movie_ids: string[];
}

export function recommendMovies(request: RecommendMeRequest) {
    return axios.post(`${getUrl('recommend-movies')}`, request);
}

export function getMovies(
    limit: number = 20,
    page: number = 1,
    q: string = ''
): Promise<MoviesResponse> {
    return axios
        .get(
            `${getUrl(`movies?size=${limit}`)}&page=${page}${
                q !== '' ? '&q=' + q : ''
            }`
        )
        .then((data) => data.data);
}

export function getRandom10s(): Promise<Movie[]> {
    return axios.get(`${getUrl('random-10s')}`).then((res) => res.data);
}
