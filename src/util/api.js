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
};
