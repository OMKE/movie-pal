from os.path import  abspath
import pandas as pd

def split_movie_years_and_genres(data: dict):
    for movie in data:
        movie_title_splitted = movie['title'].split('~')
        movie['title'] = movie_title_splitted[0].strip()
        movie['year'] = movie_title_splitted[1].strip()
        movie['genres'] = movie['genres'].split("|")
    return data


def movies(csv_file_path: str):
    return prepare_movies(abspath(csv_file_path))

def prepare_movies(csv_file_path: str):
    movies_df = pd.read_csv(csv_file_path, usecols=['movieId', 'title', 'genres'])
    movies_df_fixed = fix_movies_titles(movies_df)
    return split_movie_years_and_genres(movies_df_fixed.to_dict('records'))

def fix_movie_title(title):
    title = title.split(" ")
    year = title[-1].strip('(').strip(')')
    add_the = False
    if "The" in title or ", The" == title[-1]:
        add_the = True
    if add_the:
        name = f"The {' '.join(title[0:-2])}"
        name = name.strip(",")
        name += f' ~{year}'
        return name
    title_to_return = title[0:-1]
    title_to_return.append(f'~{year}')
    return " ".join(title_to_return)


def fix_movies_titles(movies_df):
    for index, value in enumerate(movies_df['title']):
        movies_df.at[index, 'title'] = fix_movie_title(value)
    return movies_df