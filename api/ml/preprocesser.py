import csv

if __name__ == "__main__":
  data_folder = 'data'
  rating_list = []
  movie_list = []
  rat_cap = 1000000

  with open(data_folder + '/movies.csv', 'r') as csvfile:
    movie_reader = csv.reader(csvfile, delimiter=',')

    for movie in movie_reader:
      movie_list.append(movie[0])
  movie_list = set(movie_list)

  with open(data_folder + '/ratings_large.csv', 'r') as csvfile:
    ratings_reader = csv.reader(csvfile, delimiter=',')

    itera = 0
    for rating in ratings_reader:
      user_id, movie_id, r_type, _ = rating

      if movie_id in movie_list:
        rating_list.append((user_id, movie_id, -1 if float(r_type) < 3 else 1))

      itera += 1
      if int(itera) % 100000 == 0:
        print(itera)

  with open(data_folder + '/ratings_cap.csv', 'w') as csvfile:
    ratings_writer = csv.writer(csvfile, delimiter=',',
                                quotechar='|', quoting=csv.QUOTE_MINIMAL)

    rat_number = 0
    for rating_row in rating_list:
      ratings_writer.writerow(rating_row)
      rat_number += 1

      if rat_number > rat_cap:
        break
