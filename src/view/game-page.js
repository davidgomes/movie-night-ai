import React from "react";
import { connect } from "react-redux";
import Tinderable from "./tinderable";
import { voteCurrentMovie, fetchNextMovie } from "../actions";

import "./game-page.css";

let cards = [];

for (let i = 0; i < 55; i++) {
    cards.push({ id:i.toString() });
}

class GamePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fetchedMovie: false,
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
            cards[nextProps.currentMovie].text = "hey";
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

        let inner;
        if (this.props.waitForOthers) {
            inner = (
                <div>
                    Wait a little bit for others!
                </div>
            );
        } else {
            inner = (
                <Tinderable
                    initialCardsData={cards}
                    onSwipeLeft={this.handleSwipeLeft}
                    onSwipeRight={this.handleSwipeRight}
                    onSwipeBottom={this.handleSwipeBottom}
                />
            );
        }

        return (
            <div className="game-page">
                Room {this.props.roomName}

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
}))(GamePage);
