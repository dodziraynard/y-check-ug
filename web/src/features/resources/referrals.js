
export const getReferralEndpoints = (builder) => {
    return {
        getReferrals: builder.query({
            query({ pid }) {
                return `/${pid}/referrals/`;
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
