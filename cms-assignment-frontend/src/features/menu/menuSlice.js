import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    menus: [],
    meta: null,
    loading: false,
};

const menuSlice = createSlice({
    name: "menu",

    initialState,

    reducers: {

        setMenus(state, action) {
            state.menus = action.payload.data;
            state.meta = action.payload.meta;
        },

        setLoading(state, action) {
            state.loading = action.payload;
        }

    }

});

export const {
    setMenus,
    setLoading
} = menuSlice.actions;

export default menuSlice.reducer;