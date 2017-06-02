from flask import request, Flask, abort
from werkzeug.exceptions import BadRequest
import json
import uuid
from random import randint
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

rooms = {}

@app.route("/api/room", methods=["POST"])
def create_room():
    room_num = ("%d" % randint(0, 100)).zfill(2)
    uid = uuid.uuid4()

    rooms[room_num] = {"users": [uid]}
    return json.dumps({
        "name": room_num,
        "uid": str(uid)
    })

@app.route("/api/room/join", methods=["POST"])
def join_room():
    uid = uuid.uuid4()

    if request.json == None:
        abort(400, "Expected json data")
    elif "room" not in request.json:
        abort(400, "Expected room in json data")

    room = request.json["room"]
    if room not in rooms:
        abort(400, "Unknown room")
    rooms[room]["users"].append(uid)
    return json.dumps({
        "uid": str(uid)
    })

if __name__ == "__main__":
    app.run(debug=True)
