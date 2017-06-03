import {
    FETCH_NEXT_MOVIE,
    fetchNextMovie,
} from "../actions";

let intervalId;

const middleware = store => next => action => {
    if (action.type === FETCH_NEXT_MOVIE &&
        action.payload.message &&
        action.payload.message === "Try again later" &&
        !store.getState().waitForOthers) {
        intervalId = window.setInterval(() => {
            store.dispatch(
                fetchNextMovie(store.getState().uid, store.getState().name)
            );
        }, 1000);
    } else {
        if (!store.getState().waitForOthers) {
            window.clearInterval(intervalId);
        }
    }

    next(action);
};

export default middleware;
