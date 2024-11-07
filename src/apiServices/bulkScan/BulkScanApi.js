import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const BulkScanApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        addBulkQr: builder.mutation({
            query: (params) => {
                console.log("Params from bulk api mutation",params)
              return {
                method: "POST",
                url: `/api/bulkScan/`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                  "Authorization": `Bearer ${params.token}`,
                },
                body:params.data
              };
            },
          }),
          addBulkPointOnProduct: builder.mutation({
            query: (params) => {
                console.log("Params from bulk point on product api mutation",params.token)
              return {
                method: "POST",
                url: `/api/bulkScan/points-on-product`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                  "Authorization": `Bearer ${params.token}`,
                },
                body:params.data
              };
            },
          }),
    })
});


export const {useAddBulkQrMutation,useAddBulkPointOnProductMutation} = BulkScanApi

