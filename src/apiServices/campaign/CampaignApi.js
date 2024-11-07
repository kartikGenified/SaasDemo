import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const CampaignApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppCampaign: builder.mutation({
            query: (token) => {
              return {
                method: "GET",
                url: `/api/tenant/appCampaigns/userType/id`,
                headers: {
                  Authorization: "Bearer " + token,
                  slug: slug,
                },
              };
            },
          }),
          addCampaignData: builder.mutation({
            query: (body) => {
                return {
                    method: 'POST',
                    url: `/api/app/appCampaignData/add`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + body.token,
                        slug: slug
                    },
                    body : JSON.stringify(body.data)
                }}
        }),
    })
});


export const {useAddCampaignDataMutation,useGetAppCampaignMutation} = CampaignApi

