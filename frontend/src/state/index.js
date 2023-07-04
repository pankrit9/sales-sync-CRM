// logic for the entire application (State) for redux
import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialState = {
    mode: "light",  // represents dark and light mode
    // auth information
    user: null,
    token: null,
    role: null
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setMode: (state) => {
            state.mode = state.mode === "light" ? "dark" : "light";
        },
        setLogin: (state, action) => {
            if (action.payload.token) {
                const decodedToken = jwt_decode(action.payload.token);
                state.user = decodedToken.user_id;
                state.role = decodedToken.role;
                state.token = action.payload.token;
            } else {
                state.user = null;
                state.role = null;
                state.token = null;
            }
        },
        setLogout: (state) => {
            // reset the state
            state.user = null;
            state.token = null;
            state.role = null;
        },
    },
});

export const { setMode, setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
