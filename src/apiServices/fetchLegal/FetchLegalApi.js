import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const FetchLegalApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    deleteLegal: builder.mutation({
        query: (params) => {
          return {
              method: "DELETE",
              url: `/api/tenant/legal/delete/${params.legalId}`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + params.token,
                slug: slug,
              },
            };
        },
      }),
    fetchLegals: builder.mutation({
      query: (params) => {
        return {
            method: "GET",
            url: `/api/app/legal?type=${params.type}`,
            headers: {
              "Content-Type": "application/json",
              slug: slug,
            },
          };
      },
    }),
    fetchLegalByLegalId: builder.mutation({
      query: (params) => {
        return {
            method: "GET",
            url: `/api/tenant/legal?id=${params.id}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
          };
      },
    }),
    uploadlegal: builder.mutation({
      query: (params) => {
        return {
          method: "post",
          url: `/api/tenant/legal/add`,
          headers: {
            Authorization: "Bearer " + params.token,
            slug : slug,
          },
          body : params.data
        };
      },
    }),
  }),
});

export const {useDeleteLegalMutation,useFetchLegalByLegalIdMutation,useFetchLegalsMutation,useUploadlegalMutation} = FetchLegalApi;