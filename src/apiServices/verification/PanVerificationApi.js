import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const PanVerificationApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        verifyPan: builder.mutation({
            query: (data) => {
                console.log("Data from pan api",data)
              return {
                method: "POST",
                url: `/api/verification/pan`,
                headers: {
                  "Content-Type": "application/json",
                  slug:slug
                },
                body:data
              };
            },
          }),
    })
});


export const {useVerifyPanMutation} = PanVerificationApi

