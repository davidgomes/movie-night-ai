import {
    CREATE_ROOM,
    JOIN_ROOM,
    FETCH_NEXT_MOVIE,
} from "../actions";

const reducer = (state = { currentMovie: -1 }, action) => {
    if (action.type === CREATE_ROOM) {
        state = {
            ...state,
            name: action.payload.name,
            uid: action.payload.uid,
        };
    } else if (action.type === JOIN_ROOM) {
        state = {
            ...state,
            name: action.payload.name,
            uid: action.payload.uid,
        };
    } else if (action.type === FETCH_NEXT_MOVIE) {
        state = {
            ...state,
            movie: action.payload,
            currentMovie: state.currentMovie + 1,
        };
    }

    return state;
};

export default reducer;
