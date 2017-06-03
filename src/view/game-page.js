import React from "react";
import { connect } from "react-redux";
import Tinderable from "./tinderable";

import "./game-page.css";

var data = [
    {title: 'Hello', text: 'Hey', id: '1', image: 'http://image.tmdb.org/t/p/w500/pUNcNraH6lvUvy6IBvyjJdNAd6Y.jpg'}
];

class GamePage extends React.Component {
    handleSwipeLeft = () => {
        
    };

    handleSwipeRight = () => {

    };

    handleSwipeBottom = () => {

    };

    render() {
        return (
            <div className="game-page">
                Room {this.props.roomName}

                <Tinderable
                    initialCardsData={data}
                    onSwipeLeft={this.handleSwipeLeft}
                    onSwipeRight={this.handleSwipeRight}
                    onSwipeBottom={this.handleSwipeBottom}
                />
            </div>
        );
    }
}

export default connect(s => ({ roomName: s.name }))(GamePage);
