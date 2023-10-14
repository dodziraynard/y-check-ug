import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URI } from '../../utils/constants';
import * as referrals from "./referrals"

export const resourceApiSlice = createApi({
    reducerPath: 'resources-api',
    baseQuery: fetchBaseQuery({
        baseUrl: BASE_API_URI,
        prepareHeaders(headers) {
            headers.set('Authorization', `Token ${localStorage.getItem('token')}`);
            return headers;
        },
    }),
    endpoints(builder) {
        return {
            getUserPermissions: builder.query({
                query() {
                    return `/auth/user-permissions/`;
                },
            }),

            // Groups
            getGroups: builder.query({
                query() {
                    return `/groups/`;
                },
            }),

            putGroups: builder.mutation({
                query(body) {
                    return {
                        url: `/groups/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            deleteGroups: builder.mutation({
                query(body) {
                    return {
                        url: `/groups/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // Group Permission
            getGroupPermissions: builder.query({
                query(group_id = 1) {
                    return `/permissions/group/${group_id}`;
                },
            }),

            putGroupPermissions: builder.mutation({
                query({ group_id = 1, body }) {
                    return {
                        url: `/permissions/group/${group_id}/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            // Users
            getUsers: builder.query({
                query(page = 1) {
                    return `/users/?page=${page}`;
                },
            }),

            putUsers: builder.mutation({
                query(body) {
                    return {
                        url: `/users/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            deleteUsers: builder.mutation({
                query(body) {
                    return {
                        url: `/users/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // Configurations
            getConfigurations: builder.query({
                query() {
                    return `/configurations/`;
                },
            }),

            putConfigurations: builder.mutation({
                query(body) {
                    return {
                        url: `/configurations/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            // Facilities
            getAllFacilities: builder.query({
                query() {
                    return `/all/facilities/`;
                },
            }),
            getFacilities: builder.query({
                query() {
                    return `/facilities?page_size=100`;
                },
            }),

            putFacilities: builder.mutation({
                query(body) {
                    return {
                        url: `/facilities/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            deleteFacilities: builder.mutation({
                query(body) {
                    return {
                        url: `/facilities/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // Services
            getServices: builder.query({
                query() {
                    return `/services/`;
                },
            }),
            getRecommendedServices: builder.query({
                query({ pid }) {
                    return `${pid}/recommended-services/`;
                },
            }),
            putServices: builder.mutation({
                query(body) {
                    return {
                        url: `/services/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            deleteServices: builder.mutation({
                query(body) {
                    return {
                        url: `/services/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),
            getFlagLabels: builder.query({
                query() {
                    return `/get-flags/`;
                },
            }),
            putUserBioData: builder.mutation({
                query(body) {
                    return {
                        url: `/user/bio/data/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            putUserChangePassword: builder.mutation({
                query(body) {
                    return {
                        url: `/user/change/password/`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            putUserUploadPicture: builder.mutation({
                query(body) {
                    return {
                        url: `user/upload/picture/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            ...referrals.getReferralEndpoints(builder)
        };
    },
});

export const {
    useLazyGetUserPermissionsQuery,

    // Groups
    useLazyGetGroupsQuery,
    usePutGroupsMutation,
    useDeleteGroupsMutation,

    // Group Permission
    useLazyGetGroupPermissionsQuery,
    usePutGroupPermissionsMutation,

    // Users
    useLazyGetUsersQuery,
    usePutUsersMutation,
    useDeleteUsersMutation,
    usePutUserBioDataMutation,
    usePutUserChangePasswordMutation,
    usePutUserUploadPictureMutation,
    // Configurations
    useLazyGetConfigurationsQuery,
    usePutConfigurationsMutation,

    // Facilities
    useLazyGetAllFacilitiesQuery,
    useLazyGetFacilitiesQuery,
    usePutFacilitiesMutation,
    useDeleteFacilitiesMutation,

    // Services
    useLazyGetRecommendedServicesQuery,
    useLazyGetServicesQuery,
    usePutServicesMutation,
    useDeleteServicesMutation,

    // Flag labels
    useLazyGetFlagLabelsQuery
} = resourceApiSlice;

export default resourceApiSlice;