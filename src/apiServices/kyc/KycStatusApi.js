import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const KycStatusApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getkycStatus: builder.mutation({
    query: (token) => {
    return {
    method: "GET",
    url: `/api/app/kyc`,
    headers: {
    Authorization: "Bearer " + token,
    slug: slug,
    },
    };
    },
    }),
    updateKycStatus: builder.mutation({
        query: (params) => {
          console.log("object-00988900--->",params);
          return {
            method: "PUT",
            url: `/api/app/kycStatus/${params.id}`,
            headers: {
              slug : slug,
            },
            body : params.body
          };
        },
      })
    }),
   });
   
   export const { useGetkycStatusMutation,useUpdateKycStatusMutation} = KycStatusApi;