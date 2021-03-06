import api from "../util/api";

export const CREATE_ROOM = "CREATE_ROOM";
export const JOIN_ROOM = "JOIN_ROOM";
export const FETCH_NEXT_MOVIE = "FETCH_NEXT_MOVIE";
export const REQUEST_NEXT_MOVIE = "REQUEST_NEXT_MOVIE";
export const NUMBER_OF_PLAYERS_IN_ROOM = "NUMBER_OF_PLAYERS_IN_ROOM";

export function createRoom() {
    return dispatch => {
        api.createRoom()
           .then(
               data => dispatch({ type: CREATE_ROOM, payload: data }),
               err => console.error(err)
           );
    };
}

export function joinRoom(roomName) {
    return dispatch => {
        api.joinRoom(roomName)
           .then(
               data => dispatch({ type: JOIN_ROOM, payload: data }),
               err => console.error(err)
           );
    };
}

export function getNumberOfPlayersInRoom(roomName) {
    return dispatch => {
        api.numberOfPlayersInRoom(roomName)
            .then(
                data => dispatch({type: NUMBER_OF_PLAYERS_IN_ROOM, payload: data}),
                err => console.error(err)
            );
    };
}

export function fetchNextMovie(userId, roomName) {
    return dispatch => {
        dispatch({ type: REQUEST_NEXT_MOVIE });

        api.fetchNextMovie(userId, roomName)
           .then(
               data => dispatch({ type: FETCH_NEXT_MOVIE, payload: data }),
               err => console.error(err)
           );
    };
}

export function voteCurrentMovie(userId, roomName, vote) {
    return dispatch => {
        api.voteCurrentMovie(userId, roomName, vote)
           .then(
               data => {
                   dispatch(fetchNextMovie(userId, roomName))
               },
               err => console.error(err)
           );
    };
}
