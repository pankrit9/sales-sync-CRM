// logic for the entire application (State) for redux
import { createSlice } from "@reduxjs/toolkit";
import jwt_decode from "jwt-decode";

const initialState = {
    mode: "light",  // represents dark and light mode
    // auth information
    user: null,
    name: null,
    lastName: null,
    token: null,
    role: null,
    company: null
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
                state.name = decodedToken.first_name;
                state.lastName = decodedToken.last_name;
                state.company = decodedToken.company;
                state.token = action.payload.token;
            } else {
                state.user = null;
                state.role = null;
                state.token = null;
                state.company = null;
            }
        },
        setLogout: (state) => {
            // reset the state
            state.user = null;
            state.name = null;
            state.lastName = null;
            state.token = null;
            state.role = null;
            state.company = null;
        },
    },
});

export const { setMode, setLogin, setLogout } = authSlice.actions;
export default authSlice.reducer;
