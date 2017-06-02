import {
    CREATE_ROOM,
} from "../actions";

const reducer = (state = {}, action) => {
    console.log(action);

    if (action.type === CREATE_ROOM) {
        state = {
            ...state,
            name: action.payload.name,
        };
    }

    return state;
};

export default reducer;
