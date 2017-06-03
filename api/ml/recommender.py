import csv, math
import numpy as np
from bitarray import bitarray

data_folder = 'ml/data'

class Movie:
  image_id = 0

  def __init__(self, title, genres):
    self.title = title
    self.genres = genres

  def __str__(self):
    return self.title + ", " + str(self.genres)

class Ml:
  n_movies = 0
  movie_list = []
  id_map = {}
  p_bitmask = []
  n_bitmask = []
  greedy_iterations = 40

  def __init__(self, debug=False):
    if debug:
      print("Loading movies")
    
    with open(data_folder + '/movies.csv', 'r') as csvfile:
      movie_reader = csv.reader(csvfile, delimiter=',')

      for movie in movie_reader:
        self.id_map[movie[0]] = len(self.movie_list)
        self.movie_list.append(Movie(movie[1], self.separate(movie[2])))
        self.p_bitmask.append([])
        self.n_bitmask.append([])

      self.n_movies = len(self.movie_list)

    if debug:
      print("Loaded movies")
      print("Loaded ratings")

    with open(data_folder + '/ratings.csv', 'r') as csvfile:
      rating_reader = csv.reader(csvfile, delimiter=',')

      for rating in rating_reader:
        user_id, movie_id, r_type = rating

        if int(r_type) == 1:
          self.p_bitmask[self.id_map[movie_id]].append(int(user_id) - 1)
        elif int(r_type) == -1:
          self.n_bitmask[self.id_map[movie_id]].append(int(user_id) - 1)

    for i in range(self.n_movies):
      self.p_bitmask[i].sort()
      self.n_bitmask[i].sort()

    if debug:
      print("Loaded ratings")

  def separate(self, wd):
    return wd.split("|")

  def cos_metric(self, movie_a, movie_b):
    id_a, id_b = (0, 0)
    res = 0

    while id_a < len(movie_a) and id_b < len(movie_b):
      if movie_a[id_a] < movie_b[id_b]:
        id_a += 1
      elif movie_a[id_a] > movie_b[id_b]:
        id_b += 1
      else:
        res += 1
        id_a += 1
        id_b += 1

    return res

  def rate(self, movie, movies, ratings):
    assert len(movies) == len(ratings)

    result = 0
    for i in range(len(movies)):
      result += ratings[i] * (
        self.cos_metric(self.p_bitmask[movie], self.p_bitmask[movies[i]]) +
        self.cos_metric(self.n_bitmask[movie], self.n_bitmask[movies[i]]))

    return result

  def score(self, movie_set):
    result = 0
    for i in range(len(movie_set)):
      for j in range(i + 1, len(movie_set)):
        result += math.sqrt(self.cos_metric(self.p_bitmask[movie_set[i]], self.p_bitmask[movie_set[j]]))

    return -result

  def get_pool(self, movie_pairs, funnel=0.5, num_sample=5):
    res = []

    if len(movie_pairs) == 0:
      res = list(np.random.choice(self.n_movies, num_sample, replace=False))
    else:
      sample_list = list(np.random.choice(self.n_movies, min(num_sample * 1000, 5000), replace=False))

      ratings = [i[0] for i in movie_pairs]
      movies  = [i[1] for i in movie_pairs]

      for movie in movies:
        if movie in sample_list:
          del sample_list[sample_list.index(movie)]

      rating_list = [(movie, self.rate(movie, movies, ratings)) for movie in sample_list]
      chosen_list = [i[0] for i in sorted(rating_list, key=lambda movie_pair: movie_pair[1])][::-1][:int((4 + 200 * funnel) * num_sample)]

      # Greedy optimization for most distinct
      best_score = 1
      best_set = []
      for i in range(self.greedy_iterations):
        attempt_set = list(np.random.choice(chosen_list, num_sample, replace=False))
        attempt_score = self.score(attempt_set)
        
        if attempt_score < best_score:
          best_score = attempt_score
          best_set = attempt_set
      
      res = best_set

    res.sort()
    return res

if __name__ == "__main__":
  data_folder = "data"
  m = Ml(debug=True)

  test_id = 4688
  print("Recommending from: ")
  print(m.movie_list[test_id])
  print()

  for i in m.get_pool([(1, test_id)], 0.4):
    print(m.movie_list[i])
    print(i)

  print()

  for i in m.get_pool([(1, test_id)], 0.1):
    print(m.movie_list[i])
    print(i)

  print()

  for i in m.get_pool([(1, test_id)], 0.05):
    print(m.movie_list[i])
    print(i)