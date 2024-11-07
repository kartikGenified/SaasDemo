import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const salesBoosterApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        checkSalesBooster: builder.mutation({
        query: (token) => {
        return {
        method: "GET",
        url: `/api/app/salesBooster/check`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        slug: slug,
        },
        };
        },
        })
        ,
        checkSalesBoosterOnEachScan: builder.mutation({
            query: (token) => {
                return {
                method: "GET",
                url: `/api/app/salesBooster/eachScan`,
                headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
                slug: slug,
                },
                };
                },
        }),
        claimSalesBooster : builder.mutation({
            
            query: (token) => {
                return {
                method: "POST",
                url: `/api/app/salesBooster/claim`,
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

export const {useCheckSalesBoosterMutation,useCheckSalesBoosterOnEachScanMutation,useClaimSalesBoosterMutation} = salesBoosterApi;
