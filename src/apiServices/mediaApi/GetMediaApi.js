import { baseApi } from '../baseApi';
import {slug} from '../../utils/Slug';

export const GetMediaApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        addMedia: builder.mutation({
            query: (params) => {
              return {
                method: "POST",
                url: `/api/app/media/add`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                body: params.body,
              };
            },
          }),
      
          getAllMedia: builder.mutation({
            query: (params) => {
              console.log("params", params)
              return {
                method: "POST",
                url: `/api/app/media${params.isAll ? "" : `?type=${params.type}` }`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                // body: params.body,
              };
            },
          }),
      
          getMediaById: builder.query({
            query: (params) => {
              return {
                method: "GET",
                url: `/api/app/media/${params.id}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
              };
            },
          }),
      
          updateMedia: builder.mutation({
            query: (params) => {
              return {
                method: "PUT",
                url: `/api/app/media/${params.id}`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                body: params.body,
              };
            },
          }),
          deleteMedia: builder.mutation({
            query: (params) => {
              return {
                method: "DELETE",
                url: `/api/app/media/${params.id}`,
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
   
   export const { useAddMediaMutation,useDeleteMediaMutation,useGetAllMediaMutation,useGetMediaByIdQuery,useUpdateMediaMutation} = GetMediaApi;