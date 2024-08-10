import { createSlice } from '@reduxjs/toolkit';

export const globalSlice = createSlice({
    name: "global",
    initialState: {
        groups: [],
        referralInReview: null,
        configurations: null,
        dashboardDataStartDate: "",
        dashboardDataEndDate: "",
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
        setDashboardDataStartDate: (state, action) => {
            state.dashboardDataStartDate = action.payload
        },
        setDashboardDataEndDate: (state, action) => {
            state.dashboardDataEndDate = action.payload
        },
    },
});

export const { setGroups, setReferralInReview, setConfigurations, setDashboardDataStartDate, setDashboardDataEndDate } = globalSlice.actions;
export default globalSlice.reducer;
