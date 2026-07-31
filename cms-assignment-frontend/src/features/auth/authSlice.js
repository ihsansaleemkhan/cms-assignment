import { createSlice } from "@reduxjs/toolkit";

const token = localStorage.getItem("token");

const storedUser = localStorage.getItem("user");

const initialState = {

    token,

    user: storedUser
        ? JSON.parse(storedUser)
        : null,

    isAuthenticated: !!token,

};

const authSlice = createSlice({

    name: "auth",

    initialState,

    reducers: {

        setCredentials(state, action) {

            state.token = action.payload.token;
            state.user = action.payload.user;
            state.isAuthenticated = true;

            localStorage.setItem(
                "token",
                action.payload.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload.user)
            );
        },

        setUser(state, action) {

            state.user = action.payload;

            localStorage.setItem(
                "user",
                JSON.stringify(action.payload)
            );

        },

        logoutUser(state) {

            state.token = null;
            state.user = null;
            state.isAuthenticated = false;

            localStorage.removeItem("token");
            localStorage.removeItem("user");

        },

    },

});

export const {
    setCredentials,
    setUser,
    logoutUser,
} = authSlice.actions;

export default authSlice.reducer;