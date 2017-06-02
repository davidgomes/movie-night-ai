import flask
from flask import request
import json
import uuid
from random import randint

app = flask.Flask(__name__)

rooms = {}

@app.route("/api/room", methods=["POST"])
def create_room():
    room_num = ("%d" % randint(0, 100)).zfill(2)
    uid = uuid.uuid4()

    rooms[room_num] = {'users': [uid]}
    return json.dumps({
        "name": room_num,
        "uid": str(uid)
    })

@app.route("/api/room/join", methods=["POST"])
def join_room():
    uid = uuid.uuid4()
    print(request.json)

    if request.json == None:
        return 'Expected json data'
    elif 'room' not in request.json:
        return 'Expected room in json data'
    
    room = request.json['room']
    if room not in rooms:
        return 'Unknown room'
    rooms[room]['users'].append(uid)
    return json.dumps({
        "uid": str(uid)
    })

if __name__ == "__main__":
    app.run(debug=True)
