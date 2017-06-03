import React from "react";
import _ from "lodash";
import { connect } from "react-redux";
import Tinderable from "./tinderable";
import classnames from "classnames";
import {
    voteCurrentMovie,
    fetchNextMovie,
    getNumberOfPlayersInRoom
} from "../actions";

import "./game-page.css";

let cards = [];

for (let i = 0; i < 100; i++) {
    cards.push({ id: i.toString() });
}

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchedMovie: false,
            startedRoomUsersPoller: false,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.uid && !this.props.uid) {
            this.props.dispatch(fetchNextMovie(
                nextProps.uid,
                nextProps.roomName
            ));

            this.setState({ fetchedMovie: true });
        }

        if (nextProps.currentMovie > this.props.currentMovie) {
            cards[nextProps.currentMovie].image = nextProps.movie.image;
            cards[nextProps.currentMovie].title = nextProps.movie.title;
        }

        if (nextProps.roomName && !this.state.startedRoomUsersPoller) {
            setInterval(() => {
                this.props.dispatch(getNumberOfPlayersInRoom(this.props.roomName));
            }, 2000);

            this.setState({
                startedRoomUsersPoller: true,
            });
        }
    }

    handleSwipeLeft = () => {
        const { uid, roomName } = this.props;
        this.props.dispatch(voteCurrentMovie(uid, roomName, -1));
        this.setState({ fetchedMovie: false });
    };

    handleSwipeRight = () => {
        const { uid, roomName } = this.props;
        this.props.dispatch(voteCurrentMovie(uid, roomName, 1));
        this.setState({ fetchedMovie: false });
    };

    handleSwipeBottom = () => {
        const { uid, roomName } = this.props;
        this.props.dispatch(voteCurrentMovie(uid, roomName, 2));
        this.setState({ fetchedMovie: false });
    };

    render() {
        if (!this.props.movie) {
            return null;
        }

        let tinderParentClasses = classnames({
            "tinder-hidden": this.props.waitForOthers,
        }, "tinder-container");

        let inner;
        if (this.props.gameEnded) {
            inner = (
                <div className="movie-results">
                    The mastermind AI recommends the following:
                    {
                        _.map(this.props.podium, (movie, index) => (
                            <div key={index} className="movie-result">
                                {index === 0 ? <img alt="Movie Poster" src={movie.image} /> : undefined }

                                <div>{index + 1}. {movie.title}</div>
                            </div>
                        ))
                    }
                </div>
            );
        } else {
            inner = (
                <div className={tinderParentClasses}>
                    {!this.props.waitForOthers ? (!this.props.loadingMovie ? undefined :
                        <div className="wait-little">loading...</div>) :
                        <div className="wait-little">Please wait a little bit for your friends to catch up!</div>}

                    <Tinderable
                        initialCardsData={cards}
                        onSwipeLeft={this.handleSwipeLeft}
                        onSwipeRight={this.handleSwipeRight}
                        onSwipeBottom={this.handleSwipeBottom}
                    />
                </div>
            );
        }

        return (
            <div className="game-page">
                <div className="top-bar">
                    <b>Room</b> {this.props.roomName}

                    <span className="num-users">
                        {_.isUndefined(this.props.numberOfUsers) ? null : this.props.numberOfUsers === 1 ? "Alone" : `${this.props.numberOfUsers} friends`}
                    </span>
                </div>

                {this.props.waitForOthers || this.props.gameEnded ? undefined : (
                    <div>
                        <div className="left-helper">Not interested</div>
                        <div className="right-helper">Interested!</div>
                        <div className="bottom-helper">Seen it</div>
                    </div>
                )}

                {inner}
            </div>
        );
    }
}

export default connect(s => ({
    roomName: s.name,
    uid: s.uid,
    movie: s.movie,
    currentMovie: s.currentMovie,
    waitForOthers: s.waitForOthers,
    gameEnded: s.gameEnded,
    podium: s.podium,
    loadingMovie: s.loadingMovie,
    numberOfUsers: s.numberOfUsers,
}))(GamePage);
