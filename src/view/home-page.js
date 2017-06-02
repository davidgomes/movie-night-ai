import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { createRoom } from "../actions";

import "./home-page.css";

class HomePage extends React.Component {
    handleClickCreate = () => {
        this.props.dispatch(createRoom());
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
                        <Link to="/game">Join</Link>
                    </li>
                </ul>
            </div>
        );
    }
}

export default connect()(HomePage);
