import csv, math, urllib3, json
import numpy as np

data_folder    = 'ml/data'
image_find_url = "http://api.themoviedb.org/3/movie/%d/images?api_key=%s"
image_base_url = "http://image.tmdb.org/t/p/w500%s"
image_default  = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png"
api_key = ""
dump = False

class Movie:
  def __init__(self, header, genres):
    h = header.split('(')
    self.title = '('.join(h[0:-1])
    try:
        self.year = int(h[-1].strip()[:4])
    except:
        self.year = 1888
    self.genres = genres
    self.genres.sort()
    self.image_link = image_default

  def __str__(self):
    return self.title + ", " + str(self.genres) + ", " + self.image_link

class Ml:
  n_movies = 0
  movie_list = []
  id_map = {}
  p_bitmask = []
  n_bitmask = []
  greedy_iterations = 10

  def __init__(self, debug=False):
    if debug:
      print("Loading movies")

    try:
      import apikey
      api_key = apikey.api_key
    except:
      api_key = ""
    
    with open(data_folder + '/movies.csv', 'r') as csvfile:
      movie_reader = csv.reader(csvfile, delimiter=',')

      for movie in movie_reader:
        movie_object = Movie(movie[1], self.separate(movie[2]))
        if movie_object.year < 2000:
          continue

        self.id_map[movie[0]] = len(self.movie_list)
        self.movie_list.append(movie_object)
        self.p_bitmask.append([])
        self.n_bitmask.append([])

      self.n_movies = len(self.movie_list)

    if debug:
      print("Loaded movies")
      print("Loaded ratings")

    with open(data_folder + '/ratings_cap.csv', 'r') as csvfile:
      rating_reader = csv.reader(csvfile, delimiter=',')

      for rating in rating_reader:
        user_id, movie_id, r_type = rating

        if self.id_map.get(movie_id) == None:
          continue

        if int(r_type) == 1:
          self.p_bitmask[self.id_map[movie_id]].append(int(user_id) - 1)
        elif int(r_type) == -1:
          self.n_bitmask[self.id_map[movie_id]].append(int(user_id) - 1)

    if dump:
      if api_key != "":
        with open(data_folder + '/links.csv', 'r') as csvfile:
          links_reader = csv.reader(csvfile, delimiter=',')
          http = urllib3.PoolManager()

          for link in links_reader:
            try:
              movie_id, _, tmbd_id = link

              if self.id_map.get(movie_id) == None:
                continue

              json_result = json.loads(http.request('GET', (
                image_find_url % (int(tmbd_id), api_key))).data.decode())

              for result in json_result['posters']:
                if result["aspect_ratio"] > 0.64 and result["aspect_ratio"] < 0.68 and (result["iso_639_1"] == "en" or result["iso_639_1"] == None):
                  self.movie_list[self.id_map[movie_id]].image_link = image_base_url % result["file_path"]
                  break

              if debug and self.id_map[movie_id] % 10 == 0:
                print("Processing first %d, %d left" % (self.id_map[movie_id], self.n_movies - self.id_map[movie_id]))
            except:
              pass

        with open(data_folder + '/images.csv', 'w') as csvfile:
          imagewriter = csv.writer(csvfile, delimiter=',',
                            quotechar='|', quoting=csv.QUOTE_MINIMAL)

          movie_id = 0
          for movie in self.movie_list:
            imagewriter.writerow([movie_id, movie.image_link])
            movie_id += 1
    else:
      with open(data_folder + '/images.csv', 'r') as csvfile:
        images_reader = csv.reader(csvfile, delimiter=',')

        for image in images_reader:
          movie_id, image_path = image

          if int(movie_id) >= self.n_movies:
            continue

          self.movie_list[int(movie_id)].image_link = image_path

    for i in range(self.n_movies):
      self.p_bitmask[i].sort()
      self.n_bitmask[i].sort()

    if debug:
      print("Loaded ratings")

  def separate(self, wd):
    return wd.split("|")

  def jacobbi(self, ls1, ls2):
    return float(len(np.intersect1d(ls1, ls2))) / len(np.union1d(ls1, ls2))

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
      item_cf_factor_p = 1.0 + self.cos_metric(self.p_bitmask[movie], self.p_bitmask[movies[i]])
      item_cf_normalize_p = 1 + len(self.p_bitmask[movie]) * len(self.p_bitmask[movies[i]])

      item_cf_factor = item_cf_factor_p / item_cf_normalize_p
      content_factor = self.jacobbi(self.movie_list[movie].genres, self.movie_list[movies[i]].genres)
      popularity_factor = len(self.p_bitmask[movie]) - len(self.n_bitmask[movie])

      result += ratings[i] * (item_cf_factor * 0.7 + content_factor * 0.2 + popularity_factor * 0.1)

    return max(result, 0)

  def score(self, movie_set):
    assert len(movie_set) >= 2
    result = 0

    for i in range(len(movie_set)):
      for j in range(i + 1, len(movie_set)):
        item_cf_factor_p = 1 + self.cos_metric(self.p_bitmask[movie_set[i]], self.p_bitmask[movie_set[j]])
        item_cf_normalize_p = 1 + len(self.p_bitmask[movie_set[i]]) * len(self.p_bitmask[movie_set[j]])

        item_cf_factor = item_cf_factor_p / item_cf_normalize_p
        content_factor = self.jacobbi(self.movie_list[movie_set[i]].genres, self.movie_list[movie_set[j]].genres)

        result += item_cf_factor * 0.4 + content_factor * 0.6

    return result

  def get_pool(self, movie_pairs, funnel=0.5, num_sample=5):
    res = []

    if len(movie_pairs) == 0:
      res = list(np.random.choice(self.n_movies, num_sample, replace=False))
    else:
      sample_list = list(np.random.choice(self.n_movies, min(num_sample * 200, 700), replace=False))

      ratings = [i[0] for i in movie_pairs]
      movies  = [i[1] for i in movie_pairs]

      for movie in movies:
        if movie in sample_list:
          del sample_list[sample_list.index(movie)]

      rating_list = [(movie, self.rate(movie, movies, ratings)) for movie in sample_list]
      chosen_list = [i[0] for i in sorted(rating_list, key=lambda movie_pair: movie_pair[1])][::-1][:int((3 + 50 * funnel) * num_sample)]

      # Greedy optimization for most distinct
      best_score = 10000
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

  test_id = 1200
  print("Recommending from: ")
  print(m.movie_list[test_id])
  print("")

  for i in m.get_pool([(1, test_id)], 0.4):
    print(m.movie_list[i])
    print(i)

  print("")

  for i in m.get_pool([(1, test_id)], 0.1):
    print(m.movie_list[i])
    print(i)

  print("")

  for i in m.get_pool([(1, test_id)], 0.05):
    print(m.movie_list[i])
    print(i)
