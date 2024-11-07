import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const RedeemSchemeApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        redeemSchemeApi: builder.mutation({
        query: (params) => {
        return {
        method: "POST",
        url: `/api/app/scheme/gift-redemption`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + params.token,
        slug: slug,
        },
        body:params.data
        };
        },
        }),
       
    })
});

export const {useRedeemSchemeApiMutation} = RedeemSchemeApi;
