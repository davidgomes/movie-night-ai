import api from "../util/api";

export const CREATE_ROOM = "CREATE_ROOM";

export function createRoom() {
    return dispatch => {
        api.createRoom()
           .then(
               data => dispatch({ type: CREATE_ROOM, payload: data }),
               err => console.error(err)
           );
    };
}
