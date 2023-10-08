import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        groups: [],
        referralInReview: null,
        configurations: null,
    },
    reducers: {
        setGroups: (state, action) => {
            state.groups = action.payload
        },
        setReferralInReview: (state, action) => {
            state.referralInReview = action.payload
        },
        setConfigurations: (state, action) => {
            state.configurations = action.payload
        },
    },
});

export const { setGroups, setReferralInReview, setConfigurations } = globalSlice.actions;
export default globalSlice.reducer;
