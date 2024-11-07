import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const userMappingApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    createUserMapping: builder.mutation({
        query: (params) => {
          return {
            method: "POST",
            url: `/api/tenant/user-mapping/add`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
            body: params.body,
          };
        },
      }),
      fetchUserMappingByAppUserIdAndMappedUserType: builder.mutation({
        query: (params) => {
          return {
            method: "GET",
            url: `/api/tenant/user-mapping/${params.app_user_id}?mapped_user_type=${params?.type}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
          };
        },
      }),
  
      fetchUserMappingByUserTypeAndMappedUserType: builder.mutation({
        query: (params) => {
          return {
            method: "GET",
            url: `/api/tenant/user-mapping/?user_type=${params.user_type}&&mapped_user_type=${params.mapped_user_type}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
          };
        },
      }),
  
      deleteUserMapping: builder.mutation({
        query: (params) => {
          return {
            method: "DELETE",
            url: `/api/tenant/user-mapping/${params.id}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + params.token,
              slug: slug,
            },
          };
        },
      }),
  
  
      getMappingDetailsByAppUserId: builder.mutation({
        query: (params) => {
          return {
            method: "GET",
            url: `/api/tenant/user-mapping/details/${params.id}`,
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

export const {useCreateUserMappingMutation,useDeleteUserMappingMutation,useFetchUserMappingByAppUserIdAndMappedUserTypeMutation,useFetchUserMappingByUserTypeAndMappedUserTypeMutation,useGetMappingDetailsByAppUserIdMutation} = userMappingApi;