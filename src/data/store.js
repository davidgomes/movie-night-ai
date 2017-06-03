import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "./reducer";
import middleware from "./middleware";

const store = createStore(
    reducer,
    applyMiddleware(thunk, middleware)
);

export default store;
