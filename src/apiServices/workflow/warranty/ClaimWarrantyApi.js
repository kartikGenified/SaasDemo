import {baseApi} from '../../baseApi';
import {slug} from '../../../utils/Slug';
export const ClaimWarrantyApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    claimWarranty: builder.mutation({
        query: (params) => {
          return {
            method: "POST",
            url: `/api/app/warrantyclaim/add`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
            body: JSON.stringify(params.body),
          };
        },
      }),
  
      getWarrantyClaimById: builder.mutation({
        query: (params) => {
          return {
            method: "GET",
            url: `/api/app/warrantyclaim/${params.id}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
          };
        },
      }),
  
      
    }),
});

export const {
 useClaimWarrantyMutation,useGetWarrantyClaimByIdMutation
} = ClaimWarrantyApi;
