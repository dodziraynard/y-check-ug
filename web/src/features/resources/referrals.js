
export const getReferralEndpoints = (builder) => {
    return {
        getReferrals: builder.query({
            query({ pid }) {
                return `/${pid}/referrals/`;
            },
        }),
        getReferral: builder.query({
            query({ referralId }) {
                return `/referrals/${referralId}/detail/`;
            },
        }),
        getMyReferrals: builder.query({
            query() {
                return `/my-referrals/`;
            },
        }),
        putReferrals: builder.mutation({
            query({ body, pid }) {
                return {
                    url: `/${pid}/referrals/`,
                    method: 'POST',
                    body,
                }
            },
        }),
        deleteReferrals: builder.mutation({
            query({ body, pid }) {
                return {
                    url: `/${pid}/referrals/`,
                    method: 'DELETE',
                    body,
                }
            },
        }),
    }
}
