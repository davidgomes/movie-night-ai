import api from "../util/api";

export const CREATE_ROOM = "CREATE_ROOM";
export const FETCH_NEXT_MOVIE = "FETCH_NEXT_MOVIE";

export function createRoom() {
    return dispatch => {
        api.createRoom()
           .then(
               data => dispatch({ type: CREATE_ROOM, payload: data }),
               err => console.error(err)
           );
    };
}

export function fetchNextMovie(userId, roomName) {
    return dispatch => {
        api.fetchNextMovie(userId, roomName)
           .then(
               data => dispatch({ type: FETCH_NEXT_MOVIE, payload: data }),
               err => console.error(err)
           );
    };
};
