import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        activeTopNavMenu: "home",
        groups: [],
        configurations: null,
        balance: null,
        summaryflags:[],
    },
    reducers: {
        setActiveNavMenu: (state, action) => {
            state.activeTopNavMenu = action.payload
        },
        setGroups: (state, action) => {
            state.groups = action.payload
        },
        setConfigurations: (state, action) => {
            state.configurations = action.payload
        },
        setSummaryflags: (state, action) => {
            state.configurations = action.payload
        },
    },
});

export const { setActiveNavMenu, setGroups, setConfigurations,setSummaryflags} = globalSlice.actions;
export default globalSlice.reducer;
