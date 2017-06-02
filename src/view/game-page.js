import React from "react";
import { connect } from "react-redux";

class GamePage extends React.Component {
    render() {
        return (
            <div>
                Room {this.props.roomName}
            </div>
        );
    }
}

export default connect(s => ({ roomName: s.name }))(GamePage);
