from flask import request, Flask, abort
from werkzeug.exceptions import BadRequest
import json
import uuid
from random import randint
from flask_cors import CORS
from ml.recommender import Ml
import urllib.request

rooms = {}
ml = Ml()

app = Flask(__name__)
CORS(app)

class User:
    def __init__(self, uid, cur_movie):
        self.uid = uid
        self.cur_movie = cur_movie

class Pool:
    def __init__(self):
        self.movies = []
        self.users = {}
    def add_user(self, uid):
        self.users[uid] = User(uid, 0)
    def get_user_movie(self, uid):
        user = self.users[uid]
        if user.cur_movie >= len(self.movies):
            self.movies.extend(ml.get_pool([]))

        movie = ml.movie_list[self.movies[user.cur_movie]]
        return movie
    def increment_user_movie(self, uid):
        self.users[uid].cur_movie += 1

@app.route("/api/room", methods=["POST"])
def create_room():
    room_num = ("%d" % randint(0, 100)).zfill(2)
    uid = str(uuid.uuid4())

    rooms[room_num] = Pool()
    rooms[room_num].add_user(uid)

    print('curl http://127.0.0.1:5000/api/room/movie -X GET --data \'{"room": "%s", "uid": "%s"}\' -H "Content-Type: application/json"' % (room_num, uid) )

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
        "uid": uid
    })

@app.route("/api/room/movie", methods=["POST"])
def movie():
    if request.json == None or "room" not in request.json or "uid" not in request.json:
        abort(400, "Invalid data")
    
    room = request.json["room"]
    uid = request.json["uid"]

    movie = None
    if room in rooms:
        movie = rooms[room].get_user_movie(uid)
    else:
        print("Room not found")

    if movie == None:
        return json.dumps({
            "message": "Try again later",
        })
    else:
        return json.dumps({
            "uid": str(uid),
            "image": movie.image_link,
            "title": movie.title,
            "genres": movie.genres
        })

if __name__ == "__main__":
    app.run(debug=True)
