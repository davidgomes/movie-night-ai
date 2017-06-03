import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createRoom, joinRoom } from "../actions";

import "./home-page.css";

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = { roomName: "" };
    }

    handleClickCreate = () => {
        this.props.dispatch(createRoom());
    };

    handleClickJoin = () => {
        this.props.dispatch(joinRoom(this.state.roomName));
    };

    handleChangeRoomName = (event) => {
        this.setState({ roomName: event.target.value });
    };

    render() {
        return (
            <div className="home-page">
                <ul>
                    <li>
                        <Link
                            onClick={this.handleClickCreate}
                            to="/game"
                        >
                            Create
                        </Link>
                    </li>
                    <li>
                        <input
                            type="text"
                            onChange={this.handleChangeRoomName}
                        />

                        <Link
                            onClick={this.handleClickJoin}
                            to="/game"
                        >
                            Join
                        </Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default connect()(HomePage);
