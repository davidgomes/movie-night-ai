import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createRoom, joinRoom } from "../actions";

import "./home-page.css";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roomName: "", writingRoomName: false };
    }

    handleClickCreate = () => {
        this.props.dispatch(createRoom());
    };

    handleClickStartJoin = (evt) => {
        evt.preventDefault();

        this.setState({
            writingRoomName: true,
        });
    };

    handleClickJoin = () => {
        this.props.dispatch(joinRoom(this.state.roomName));
    };

    handleChangeRoomName = (event) => {
        this.setState({ roomName: event.target.value });
    };

    render() {
        let inner;

        if (!this.state.writingRoomName) {
            inner = (
                <div>
                    <li>
                        <Link
                            onClick={this.handleClickCreate}
                            to="/game"
                        >
                            Create Room
                        </Link>
                    </li>

                    <li>
                        <Link
                            onClick={this.handleClickStartJoin}
                            to="#"
                        >
                            Join Room
                        </Link>
                    </li>
                </div>
            );
        } else {
            inner = (
                <li>
                    <input
                        type="text"
                        onChange={this.handleChangeRoomName}
                        placeholder="Enter room name here..."
                        autoFocus
                    />

                    <Link
                        onClick={this.handleClickJoin}
                        to="/game"
                    >
                        Join Room
                    </Link>
                </li>
            );
        }

        return (
            <div className="home-page">
                <div>
                    <h1>Movie Night AI</h1>
                    <h5>The mastermind that decides what movie your crew will watch tonight.</h5>

                    <ul>
                        {inner}
                    </ul>
                </div>
            </div>
        );
    }
}

export default connect()(HomePage);
