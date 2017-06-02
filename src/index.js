import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import { Switch, Route } from "react-router-dom";
import HomePage from "./view/home-page";
import GamePage from "./view/game-page";
import { Provider } from "react-redux";
import store from "./data/store";

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <div>
                <Switch>
                    <Route exact path="/" component={HomePage} />
                    <Route exact path="/game" component={GamePage} />
                </Switch>
            </div>
        </HashRouter>
    </Provider>
), document.getElementById("root"));
