from fastapi import FastAPI
from util.api_helper import url
from util.data_helpers import movies
from requests.liked_movies import LikedMovies
from os.path import abspath
from core.movie_recommender import MovieRecommender
# Initalize FastAPI
app = FastAPI()


@app.get("/")
async def root():
    return {
        'author': 'Omar Iriskic',
        'contac': 'contact@omaririskic.com',
        'api_version': '1.0.0'
    }


# Get all movies
@app.get(url('movies'))
async def get_movies():
    return movies('../../datasets/movies-fixed.csv')


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
    return movie_recommender.recommend(as_dict=True)