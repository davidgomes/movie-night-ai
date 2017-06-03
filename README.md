# Movie Night AI
The AI-powered mastermind that decides what movie your crew will watch tonight.

## How does it work?
It's almost 9pm, dinner is over and the kitchen is finally clean. Mary and Peter came over to hang out, but you don't know what movie you should watch. Don't worry, "Movie Night" can help you together with its library of over 9000 movies.

Fire up our app and create or join a friend's room. Then, you can start to quickly and easily rate movies as "Interested", "Not Interested" or "Seen It". In the beginning, our app will get a feel for everyone's interests by suggesting movies as far apart in style as possible.

Our AI will then progressively use these ratings to start narrowing down on a set of movies that are of interest to the whole group. It does this using an hybrid recommendation algorithm that combines classic recommendation techniques (collaborative filtering, content-based filtering and some heuristics). This allows it to find movies similar to the ones you are interested in and different from movies that you do not want to watch.

This mechanism thus acts like a "funnel", finding common ground between the participants and then suggesting the top movies that pleased the most people in the group. This incremental nature is achieved using a cool down parameter that controls the randomness and distinctness the algorithm uses - going from an exploratory method and converging to a method that tries to find the best movie for your evening.

The UI itself is very simple with 3 simple swipe gestures - right, left and down. As soon as the group is ready, you simply have to use these gestures to go through our funnel. It should take about 15-20 ratings for a group of 4-5 friends for the app to make a final recommendation.

So, as you can see, our app is not only fun to use but also fast to reach effective results!

## Screenshots
![Animated GIF of our app](http://g.recordit.co/b6S0UQqeKp.gif)
![Another animated GIF of our app](http://g.recordit.co/hAQIlLz8TF.gif)
![Sample screenshot](http://i.imgur.com/LI4LvI0.png)

## Tech
We get easily excited with tech and so we love sharing what we used to build this application during the 24 hours What The Hack hackathon.

In the frontend, we used React and Redux for the UI. For the backend, we used Python 3 + Flask for the API as well as Numpy for the efficient numeric calculations. All of the source code is open source and right here in this repository so don't be afraid to read through it.

## Running the frontend
1. Run `npm install`.
2. Run `npm start`.

## Running the API

1. Install Python 3.
2. Run `python3 -m venv api`.
3. Run `cd api`.
4. Run `source bin/activate`.
5. Run `pip install -r requirements.txt`.
6. Run `python3 api.py` to start the API.

Remember to add any dependencies to `requirements.txt` before pushing.