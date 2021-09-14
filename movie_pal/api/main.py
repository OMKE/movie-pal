from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from fastapi_pagination import Page, add_pagination, paginate
from util.api_helper import url, NO_POSTER
from util.data_helpers import movies
from client_requests.liked_movies import LikedMovies
from os.path import abspath
from core.movie_recommender import MovieRecommender
from core.env_reader import EnvironmentReader
import requests
import random

# Initalize FastAPI
app = FastAPI()


origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

env_reader = EnvironmentReader()
OMDB_API_KEY = env_reader.get('OMDB_API_KEY')



class Movie(BaseModel):
    movieId: int
    title: str
    genres: list
    year: str
    poster: Optional[str]
    imdbRating: Optional[str]


@app.get("/")
async def root():
    return {
        'author': 'Omar Iriskic',
        'contac': 'contact@omaririskic.com',
        'api_version': '1.0.0'
    }


movies = [Movie(movieId=movie['movieId'], title=movie['title'], genres=movie['genres'],
                year=movie['year']) for movie in movies('../../datasets/movies-fixed.csv')]

# Get all movies
@app.get(url('movies'), response_model=Page[Movie])
async def get_movies(size: int = Query(None, le=30), q: Optional[str] = None):
    movies_result = []
    if q:
        for movie in movies:
            if q.lower() in movie.title.lower():
                movies_result.append(movie)

    movies_paginated = paginate(movies if not q else movies_result)
    for movie in movies_paginated.items:
        omdb_request = requests.get(url='https://www.omdbapi.com/', params={'t': movie.title, 'y': movie.year, 'apiKey': OMDB_API_KEY})
        omdb_response = omdb_request.json()
        if 'Poster' in omdb_response:
            movie.poster = omdb_response['Poster']
        else:
            movie.poster = NO_POSTER
        if 'imdbRating' in omdb_response:
            movie.imdbRating = omdb_response['imdbRating']
        else:
            movie.imdbRating = 'No rating'
    return movies_paginated

@app.get(url('random-10s'))
async def get_random_10_movies():
    random_10s = random.sample(movies, 10)
    for movie in random_10s:
        omdb_request = requests.get(url='https://www.omdbapi.com/', params={'t': movie.title, 'y': movie.year, 'apiKey': OMDB_API_KEY})
        omdb_response = omdb_request.json()
        if 'Poster' in omdb_response:
            movie.poster = omdb_response['Poster']
        else:
            movie.poster = NO_POSTER
        if 'imdbRating' in omdb_response:
            movie.imdbRating = omdb_response['imdbRating']
        else:
            movie.imdbRating = 'No rating'
    return random_10s


@app.post(url('recommend-movies'))
async def recommend_movies(liked_movies: LikedMovies):
    # TODO Check that every id got from request is indeed valid movieId

    # Join all ids as string
    liked_movies_ids = ",".join(liked_movies.movie_ids)

    movie_recommender = MovieRecommender(
        abspath('../../trained_models/kmeans-trained-model.pkl'),
        abspath('../../datasets/clusters_movies_dataset.pkl'),
        abspath('../../datasets/users_clusters.pkl'),
        abspath('../../trained_models/count-vectorizer-model.pkl'),
        abspath('../../datasets/movie.csv')
    )
    movie_recommender.prepare([liked_movies_ids])
    recommender_result = movie_recommender.recommend(limit=30, as_dict=True)
    random.shuffle(recommender_result)
    for movie in recommender_result:
        omdb_request = requests.get(url='https://www.omdbapi.com/', params={'t': movie['title'], 'y': movie['year'], 'apiKey': OMDB_API_KEY})
        omdb_response = omdb_request.json()
        if 'Poster' in omdb_response:
            movie['poster'] = omdb_response['Poster']
        else:
            movie['poster'] = NO_POSTER
        if 'imdbRating' in omdb_response:
            movie['imdbRating'] = omdb_response['imdbRating']
        else:
            movie['imdbRating'] = 'No rating'

    return recommender_result



add_pagination(app)
