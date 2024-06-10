
export const getDashboardData = (builder) => {
    return {
        getFlagColourDistribution: builder.query({
            query() {
                return `/flag-colour-distribution/`;
            },
        }),
    }
}
