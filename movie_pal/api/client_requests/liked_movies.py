from pydantic import BaseModel

class LikedMovies(BaseModel):
    movie_ids: list