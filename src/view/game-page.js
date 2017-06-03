import React from "react";
import { connect } from "react-redux";
import Tinderable from "./tinderable";
import { voteCurrentMovie, fetchNextMovie } from "../actions";

import "./game-page.css";

const cards = [{id:"1"}, {id:"2"}, {id:"3"}];

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

        return (
            <div className="game-page">
                Room {this.props.roomName}

                <Tinderable
                    initialCardsData={cards}
                    onSwipeLeft={this.handleSwipeLeft}
                    onSwipeRight={this.handleSwipeRight}
                    onSwipeBottom={this.handleSwipeBottom}
                />
            </div>
        );
    }
}

export default connect(s => ({
    roomName: s.name,
    uid: s.uid,
    movie: s.movie,
    currentMovie: s.currentMovie,
}))(GamePage);
