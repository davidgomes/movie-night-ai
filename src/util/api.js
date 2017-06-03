import xr from "xr";

const API_HOST = "http://127.0.0.1:5000";

export default {
    createRoom: () => {
        return xr({
            method: "POST",
            url: `${API_HOST}/api/room`,
        }).then(
            res => res.data,
            err => err
        );
    },

    fetchNextMovie: (userId, roomName) => {
        return xr({
            method: "POST",
            url: `${API_HOST}/api/room/movie`,
            data: {
                uid: userId,
                room: roomName,
            }
        }).then(
            res => res.data,
            err => err
        );
    },
};
