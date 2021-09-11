import { Movie } from './../domain/models/Movie';

const API_VERSION = process.env.REACT_APP_API_VERSION;
const APP_DOMAIN = process.env.REACT_APP_APP_DOMAIN;

const getUrl = (path: string) => {
    return `${APP_DOMAIN}/api/${API_VERSION}/${path}`
}

interface MoviesResponse {
    items: Movie[];
    total: number;
    size: number;
    page: number;
}

export function getMovies(limit:number = 20): Promise<MoviesResponse>
{
    return fetch(`${getUrl(`movies?size=${limit}`)}`).then(data => data.json())
}