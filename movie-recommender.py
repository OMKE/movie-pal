#!/usr/bin/env python
# coding: utf-8

from exceptions import NotPreparedException, UnableToPredictUserCluster
import pickle
import pandas as pd

class MovieRecommender:
    def __init__(self, model_file_name, movies_clusters_filename, users_clusters_filename, count_vectorizer_filename, movies_csv_filename):
        self.model = self.load(model_file_name)
        self.movies_clusters = self.load(movies_clusters_filename)
        self.users_clusters = self.load(users_clusters_filename)
        self.count_vectorizer = self.load(count_vectorizer_filename)
        self.movies_data = self.load_csv(movies_csv_filename, ['movieId', 'title', 'genres'])
        self.fix_movies_titles()
        self.movie_ids_that_user_reviewed = []


    def prepare(self, movies_ids_that_user_liked):
        matrix_transformed = self.count_vectorizer.transform(movies_ids_that_user_liked)
        matrix_array = matrix_transformed.toarray()
        movies_ids = self.count_vectorizer.get_feature_names()
        predicted_user_cluster = self.model.predict(matrix_array, size_min=None, size_max=None)
        if len(predicted_user_cluster) == 0:
            raise UnableToPredictUserCluster
        predicted_user_cluster_number = predicted_user_cluster[0]

        self.movie_cluster_of_user = self.movies_clusters[predicted_user_cluster_number]

        self.movies_ids = list(self.movie_cluster_of_user['movieId'])

        splitted_movies_ids = movies_ids_that_user_liked[0].split(",")
        self.movie_ids_that_user_reviewed = [movie_id.strip() for movie_id in splitted_movies_ids]


    def recommend(self, limit=15, as_dict=False):
        if len(self.movies_ids) == 0:
            raise NotPreparedException()
        # Kopiramo listu kako ne bi radili sa pravim podacima
        movies_ids_result = self.movies_ids.copy()
        # Prodjemo kroz sve filmove koje je korisnik ocijenio
        for user_movie in self.movie_ids_that_user_reviewed:
            # ako se film nalazi u klasteru u kom trazimo (movie_ids_result), uklonit cemo ga
            if user_movie in movies_ids_result:
                movies_ids_result.remove(user_movie)
        # Rezultujuci skup koji cemo popuniti na osnovu id-jeva filmova koje smo prethodno dobili
        # Pogledat cemo da li se podudara sa filmom iz self.movies_data (movie.csv), uzet cemo njegov naslov
        # Ako je as_dict=True, filmovi ce se vracati kao string, u suprotnom kao rjecnik
        result = []
        for movie_id in movies_ids_result:
            title = list(self.movies_data[self.movies_data['movieId'] == movie_id]['title'])
            if title:
                prepared_title = str(title).split('[')[1].split(']')[0].strip("'")
                if as_dict:
                    prepared_title_splitted = prepared_title.split('~')
                    prepared_title = {
                        'title': prepared_title_splitted[0].strip(),
                        'year': prepared_title_splitted[1].strip()
                    }
                result.append(prepared_title)
        return result[:limit]

    def fix_movies_titles(self):
        for index, value in enumerate(self.movies_data['title']):
            self.movies_data.at[index, 'title'] = self.fix_movie_title(value)

    # Filmovi koji bi trebali pocinjati sa 'The', imaju 'The' na kraju, sa ovom funkcijom to popravljamo i dodajemo godinu sa posebnim znakom,
    # kako bi je kasnije mogli lako odvojiti pri pronalasku postera
    def fix_movie_title(self, title):
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

    # Save model to file
    def save(self, path, data):
        with open(path, 'wb') as file:
            pickle.dump(data, file)

    # Load model from file
    def load(self, path):
        with open(path, 'rb') as file:
            return pickle.load(file)

    def load_csv(self, path, cols):
        return pd.read_csv(path, usecols=cols)

if __name__ == '__main__':
    movie_rcmd = MovieRecommender(
        'trained_models/kmeans-trained-model.pkl',
        'datasets/clusters_movies_dataset.pkl',
        'datasets/users_clusters.pkl',
        'trained_models/count-vectorizer-model.pkl',
        'datasets/movie.csv'
    )
    movie_rcmd.prepare(['14,21,50,56,109,23,221,180,161,240,236,320,369,413'])
    recommeded_movies = movie_rcmd.recommend(as_dict=True)
    print(recommeded_movies)
