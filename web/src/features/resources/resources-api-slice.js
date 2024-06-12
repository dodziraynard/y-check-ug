import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_API_URI } from '../../utils/constants';
import * as referrals from "./referrals"
import * as dashboardStats from "./dashboard-stats"

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

            changeOwnPassword: builder.mutation({
                query(body) {
                    return {
                        url: `/auth/change-own-password/`,
                        method: 'POST',
                        body,
                    }
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

            getAllPendingReferrals: builder.query({
                query() {
                    return `/pending/referrals/notification/`;
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

            deletePatients: builder.mutation({
                query(body) {
                    return {
                        url: `web-adolescents/`,
                        method: 'DELETE',
                        body,
                    }
                },
            }),

            // Adolescent
            getAllAdolescentTypes: builder.query({
                query() {
                    return `/web-adolescents-types/`;
                },
            }),

            getBasicDemographics: builder.query({
                query() {
                    return `/basic-demographics/`;
                },
            }),
            getSecondaryDemographics: builder.query({
                query() {
                    return `/secondary-demographics/`;
                },
            }),

            getCommunityDemographics: builder.query({
                query() {
                    return `/community-demographics/`;
                },
            }),

            putUpdateAdolescentStatus: builder.mutation({
                query({ body, pid }) {
                    return {
                        url: `/update-adolescent-status/${pid}`,
                        method: 'POST',
                        body,
                    }
                },
            }),
            getAdolescentActivity: builder.query({
                query({ adolescent_id }) {
                    return `/adolescent-activity/?adolescent_id=${adolescent_id}`;
                },
            }),
            // apk
            putApkUploadFile: builder.mutation({
                query(body) {
                    return {
                        url: `upload-apk/`,
                        method: 'POST',
                        body,
                    }
                },
            }),

            ...referrals.getReferralEndpoints(builder),
            ...dashboardStats.getDashboardData(builder),
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
    useLazyGetAllPendingReferralsQuery,

    // Services
    useLazyGetRecommendedServicesQuery,
    useLazyGetServicesQuery,
    usePutServicesMutation,
    useDeleteServicesMutation,

    // Flag labels
    useLazyGetFlagLabelsQuery,
    //Adolescents-Types
    useLazyGetAllAdolescentTypesQuery,
    usePutUpdateAdolescentStatusMutation,
    useLazyGetAdolescentActivityQuery,
    // Patients
    useDeletePatientsMutation,
    // apk
    usePutApkUploadFileMutation,
    useChangeOwnPasswordMutation,

    // Dashboard stats
    useLazyGetFlagColourDistributionQuery,
    useLazyGetBasicDemographicsQuery,
    useLazyGetSecondaryDemographicsQuery,
    useLazyGetCommunityDemographicsQuery
} = resourceApiSlice;

export default resourceApiSlice;