import { apiSlice } from "@/api/appSlice";

export const labsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getLabs: builder.query({
            query: () => "laboratory/details/",
            keepUnusedDataFor: 5,
        })
            
    })
})

export const { useGetLabsQuery } = labsApiSlice;