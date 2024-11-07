import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const getAllCouponsApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAllCoupons: builder.mutation({
            query: (token) => {
              return {
                method: "GET",
                url: `/api/tenant/oopl/dynamic-coupons`,
                headers: {
                  Authorization: "Bearer " + token,
                  slug: slug,
                },
              };
            },
          }),
          createCouponRequest: builder.mutation({
            query: (body) => {
            // alert("hello")
                return {
                    method: 'POST',
                    url: `/api/tenant/oopl/create`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + body.token,
                        slug: slug
                    },
                    body : JSON.stringify(body.data)
                }}
        }),
        getAllUserCoupons: builder.mutation({
          query: (body) => {
            console.log("getAllUserCoupons",body)
              return {
                  method: 'POST',
                  url: `/api/tenant/oopl/history/${body.app_user_id}`,
                  headers: {
                      "Content-Type": "application/json",
                      Authorization: "Bearer " + body.token,
                      slug: slug
                  },
                 
              }}
      }),
    })
});


export const {useGetAllCouponsMutation,useCreateCouponRequestMutation,useGetAllUserCouponsMutation} = getAllCouponsApi

