import flask
import json

app = flask.Flask(__name__)

@app.route("/example", methods=["GET"])
def api_example():
    return json.dumps({
        "key": "value",
    })

if __name__ == "__main__":
    app.run()
