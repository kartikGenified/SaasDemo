import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetSchemeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkActiveScheme: builder.mutation({
        query: (token) => {
        return {
        method: "GET",
        url: `/api/app/scheme/check`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        slug: slug,
        },
        };
        },
        }),
        checkAllScheme: builder.mutation({
            query: (params) => {
            return {
            method: "GET",
            url: `/api/app/scheme/info?start_date=${params.startDate}&end_date=${params.endDate}`,
            headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
            slug: slug,
            },
            };
            },
            })
    })
});

export const {useCheckActiveSchemeMutation,useCheckAllSchemeMutation} = GetSchemeApi;
