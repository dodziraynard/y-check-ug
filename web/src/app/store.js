import { configureStore } from "@reduxjs/toolkit";
import authenticationReducer, { apiSlice } from "../features/authentication/authentication-api-slice";
import globalReducer from "../features/global/global-slice";
import { resourceApiSlice } from "../features/resources/resources-api-slice";

export const store = configureStore({
    reducer: {
        authentication: authenticationReducer,
        global: globalReducer,
        [apiSlice.reducerPath]: apiSlice.reducer,
        [resourceApiSlice.reducerPath]: resourceApiSlice.reducer,
    },
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware()
            .concat(apiSlice.middleware)
            .concat(resourceApiSlice.middleware);
    },
});
