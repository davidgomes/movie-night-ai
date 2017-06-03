import {
    CREATE_ROOM,
    JOIN_ROOM,
    FETCH_NEXT_MOVIE,
    REQUEST_NEXT_MOVIE,
    NUMBER_OF_PLAYERS_IN_ROOM,
} from "../actions";

const reducer = (state = { currentMovie: -1 }, action) => {
    if (action.type === CREATE_ROOM) {
        state = {
            ...state,
            name: action.payload.name,
            uid: action.payload.uid,
        };
    } else if (action.type === NUMBER_OF_PLAYERS_IN_ROOM) {
        state = {
            ...state,
            numberOfUsers: action.payload.players,
        };
    } else if (action.type === JOIN_ROOM) {
        state = {
            ...state,
            name: action.payload.name,
            uid: action.payload.uid,
        };
    } else if (action.type === REQUEST_NEXT_MOVIE) {
        state = {
            ...state,
            loadingMovie: true,
        };
    } else if (action.type === FETCH_NEXT_MOVIE) {
        if (action.payload.message) {
            if (action.payload.message === "Game ended") {
                state = {
                    ...state,
                    gameEnded: true,
                    podium: action.payload.podium,
                    waitForOthers: false,
                    loadingMovie: false,
                };
            } else if (action.payload.message === "Try again later") {
                state = {
                    ...state,
                    waitForOthers: true,
                    loadingMovie: false,
                };
            }
        } else {
            state = {
                ...state,
                movie: action.payload,
                currentMovie: state.currentMovie + 1,
                waitForOthers: false,
                loadingMovie: false,
            };
        }
    }

    return state;
};

export default reducer;
