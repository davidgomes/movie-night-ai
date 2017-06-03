from flask import request, Flask, abort
from werkzeug.exceptions import BadRequest
import json, math, uuid, namelist
from random import randint
from flask_cors import CORS, cross_origin
from ml.recommender import Ml
import urllib.request
import numpy as np

rooms = {}
ml = Ml()

app = Flask(__name__)
CORS(app)

class User:
    def __init__(self, uid, cur_movie):
        self.uid = uid
        self.cur_movie = cur_movie
        self.votes = []

    def __srt__(self):
        return str(self.uid) + ", " + str(self.cur_movie)

class Pool:
    ROUNDS = 18

    def __init__(self):
        self.movies = []
        self.users = {}
        self.block = False

    def add_user(self, uid):
        self.users[uid] = User(uid, 0)

    def check_next(self, cur_movie):
        if cur_movie >= self.ROUNDS:
            return 2
 
        cur = min([u.cur_movie for u in self.users.values()])
        if cur_movie - cur <= 5:
            return 1
        return 0

    def round_value(self, round_number):
        if round_number < 6:
            return 1
        return int(math.sqrt(round_number - 5) + 1)

    def sum_votes(self, final=False):
        votes = np.array([0] * max([len(u.votes) for u in self.users.values()]))
        for u in self.users.values():
            fixed_votes = []
            round_number = 0

            for v in u.votes:
                if v == 2:
                    if final:
                        fixed_votes.append(-10000)
                    else:
                        fixed_votes.append(1)
                else:
                    if final:
                        fixed_votes.append(v * self.round_value(round_number))
                    else:
                        fixed_votes.append(v)
                round_number += 1
            while len(fixed_votes) < len(votes):
                fixed_votes.append(0)
            votes += np.array(fixed_votes)
        votes = list(zip(self.movies, votes))
        return votes

    def get_user_movie(self, uid):
        user = self.users[uid]

        if user.cur_movie >= len(self.movies):
            check = self.check_next(user.cur_movie)
            if check == 1:
                if self.block:
                    print("Blocked")
                    return (1, None)

                votes = self.sum_votes()

                more_movies = 2
                if len(self.movies) == 0:
                    more_movies = 5

                self.block = True
                self.movies.extend(ml.get_pool(list(votes), max(0, (7 - len(self.movies)) / 15), more_movies))
                self.block = False

                movie = ml.movie_list[self.movies[user.cur_movie]]

                return (0, movie)
            elif check == 2:
                ending = True
                for u in self.users.values():
                    if u.cur_movie != user.cur_movie:
                        ending = False
                if ending:
                    votes = sorted([(j, ml.movie_list[i] ) for i,j in self.sum_votes(final=True)], key=lambda x: -x[0] )
                    print(votes)
                    votes = votes[:3]
                    votes = [i for _,i in votes]
                    return (2, votes)
                else:
                    return (2, None)
            else:
                return (1, None)
        else:
            movie = ml.movie_list[self.movies[user.cur_movie]]
            return (0, movie)

    def increment_user_movie(self, user):
        user.cur_movie += 1

    def put_user_vote(self, uid, vote):
        user = self.users[uid]

        if len(user.votes) == len(self.movies):
            print('Already voted for all available movies')
            return False

        user.votes.append(vote)
        self.increment_user_movie(user)
        return True

@app.route("/api/room", methods=["POST"])
def create_room():
    room_num = ("%s%s" % (namelist.names[randint(0, len(namelist.names) - 1)], str(randint(0, 100)).zfill(2)))
    uid = str(uuid.uuid4())

    rooms[room_num] = Pool()
    rooms[room_num].add_user(uid)

    print('curl http://127.0.0.1:5000/api/room/movie -X POST --data \'{"room": "%s", "uid": "%s"}\' -H "Content-Type: application/json"' % (room_num, uid) )
    print('curl http://127.0.0.1:5000/api/room/vote -X POST --data \'{"room": "%s", "uid": "%s", "vote": 1}\' -H "Content-Type: application/json"' % (room_num, uid) )

    return json.dumps({
        "name": room_num,
        "uid": uid
    })

@app.route("/api/room/join", methods=["POST"])
def join_room():
    uid = str(uuid.uuid4())

    if request.json == None:
        abort(400, "Expected json data")
    elif "room" not in request.json:
        abort(400, "Expected room in json data")

    room = request.json["room"]
    if room not in rooms:
        abort(400, "Unknown room")
    rooms[room].add_user(uid)
    return json.dumps({
        "uid": uid,
        "name": room,
    })

@app.route("/api/room/movie", methods=["POST"])
def movie():
    if request.json == None or "room" not in request.json or "uid" not in request.json:
        abort(400, "Invalid data")

    room = request.json["room"]
    uid = request.json["uid"]

    res = None
    movie = None
    if room in rooms:
        res, movie = rooms[room].get_user_movie(uid)
    else:
        print("Room not found")

    if res == 1:
        return json.dumps({
            "status": "retry",
            "message": "Try again later",
        })
    elif res == 2:
        if movie == None:
            return json.dumps({
                "status": "retry",
                "message": "Try again later",
            })
        else:
            podium = []
            for m in movie:
                podium.append(
                   {"uid": str(uid),
                    "image": m.image_link,
                    "title": m.title,
                    "genres": m.genres}
                )
            return json.dumps({
                "message": "Game ended",
                "podium": podium
            })
    else:
        return json.dumps({
            "uid": str(uid),
            "image": movie.image_link,
            "title": movie.title,
            "genres": movie.genres
        })


@app.route("/api/room/vote", methods=["POST"])
def vote():
    if request.json == None or "room" not in request.json or "uid" not in request.json or "vote" not in request.json:
        abort(400, "Invalid data")

    room = request.json["room"]
    uid = request.json["uid"]
    vote = request.json["vote"]

    res = rooms[room].put_user_vote(uid, int(vote))

    if res == False:
        return json.dumps({
            "message": "Already voted for all available movies",
        })
    else:
        return json.dumps({
            "message": "ok",
        })

@app.route("/api/room/players", methods=["POST"])
def players():
    if request.json == None or "room" not in request.json:
        abort(400, "Invalid data: expected room")
    return json.dumps({
        "players": len(rooms[request.json["room"]].users),
    })

if __name__ == "__main__":
    app.run(threaded=True)
