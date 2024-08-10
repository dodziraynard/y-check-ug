
export const getDashboardData = (builder) => {
    return {
        getFlagColourDistribution: builder.query({
            query({ start_date = "", end_date = "" }) {
                return `/flag-colour-distribution?start_date=${start_date}&end_date=${end_date}`;
            },
        }),
    }
}
