import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createRoom } from "../actions";

class HomePage extends React.Component {
    handleClickCreate = () => {
        this.props.dispatch(createRoom());
    };

    render() {
        return (
            <div>
                <Link onClick={this.handleClickCreate} to="/game">Create</Link>
                <Link to="/game">Join</Link>
            </div>
        );
    }
}

export default connect()(HomePage);
