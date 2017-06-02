import bitarray, csv
import numpy as np

data_folder = 'ml/data'

def separate(wd):
  return wd.split("|")

class Movie:
  def __init__(self, title, genres):
    self.title = title
    self.genres = genres

class Ml:
  n_movies = 0
  movie_list = []
  id_map = {}

  def __init__(self):
    with open(data_folder + '/movies.csv', 'r') as csvfile:
      movie_reader = csv.reader(csvfile, delimiter=',')

      for movie in movie_reader:
        self.id_map[movie[0]] = len(self.movie_list)
        self.movie_list.append(Movie(movie[1], separate(movie[2])))

      self.n_movies = len(self.movie_list)

  def get_pool(self, movies, num_sample=5):
    res = []

    if len(movies) == 0:
      res = list(np.random.choice(self.n_movies, num_sample, replace=False))
    else:
      res = list(np.random.choice(self.n_movies, num_sample, replace=False))

    res.sort()
    return res

if __name__ == "__main__":
  m = Ml()
  data_folder = "data"
  print(m.get_pool([]))
