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

    numberOfPlayersInRoom: (roomName) => {
        return xr({
            method: "POST",
            url: `${API_HOST}/api/room/players`,
            data: {
                room: roomName,
            }
        }).then(
            res => res.data,
            err => err
        );
    },

    joinRoom: (roomName) => {
        return xr({
            method: "POST",
            url: `${API_HOST}/api/room/join`,
            data: {
                room: roomName,
            }
        }).then(
            res => res.data,
            err => err
        );
    },

    voteCurrentMovie: (userId, roomName, vote) => {
        return xr({
            method: "POST",
            url: `${API_HOST}/api/room/vote`,
            data: {
                uid: userId,
                room: roomName,
                vote: vote,
            }
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
