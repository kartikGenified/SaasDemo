import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const RedemptionApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        addGiftRedemptions: builder.mutation({
            query: (params) => {
                // console.log("params--->",params);
                return {
                    method: 'POST',
                    url: `api/app/giftRedemptions/add`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + params.token,
                        slug: slug
                    },
                    body: JSON.stringify(params.body)
                }
            }
        }),
        fetchGiftsRedemptionsOfUser: builder.mutation({
            query: (params) => {
                // console.log("params--->",params);
                return {
                    method: 'GET',
                    url: `api/app/userPointRedemptions/${params.userId}/${params.type}`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + params.token,
                        slug: slug
                    },
                }
            }
        }),
    })
});


export const {useAddGiftRedemptionsMutation,useFetchGiftsRedemptionsOfUserMutation} = RedemptionApi

