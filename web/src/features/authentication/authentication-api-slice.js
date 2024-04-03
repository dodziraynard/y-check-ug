import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { createSlice } from '@reduxjs/toolkit';
import { BASE_API_URI } from '../../utils/constants';

// Retrieve the user permissions from local storage
let userPermissions = localStorage.getItem('user_permissions')
if (userPermissions === null || userPermissions === 'undefined') {
    userPermissions = "[]"
}

export const authenticationSlice = createSlice({
    name: "authentication",
    initialState: {
        user: localStorage.getItem("user") != "undefined" ? JSON.parse(localStorage.getItem("user") || "{}") : "{}",
        token: localStorage.getItem("token"),
        userPermissions: JSON.parse(userPermissions || "{}"),
    },
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload
        },
        setToken: (state, action) => {
            state.token = action.payload
        },
        setUserPermissions: (state, action) => {
            state.userPermissions = action.payload
        },
        logOutLocally: (state) => {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            state.token = null
            state.user = null
        }
    },
});

export const { setUser, setToken, logOutLocally, setUserPermissions } = authenticationSlice.actions;
export default authenticationSlice.reducer;


export const apiSlice = createApi({
    reducerPath: 'auth-api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URI
    }),
    endpoints(builder) {
        return {
            loginUser: builder.mutation({
                query(body) {
                    return {
                        url: `/auth/login/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            registerUser: builder.mutation({
                query(body) {
                    return {
                        url: `/auth/register/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            logOutUser: builder.mutation({
                query() {
                    return {
                        url: `/auth/logout/`,
                        method: 'POST',
                    }
                },
            }),
        };
    },
});

export const { useLoginUserMutation, useRegisterUserMutation, useLogOutUserMutation } = apiSlice;