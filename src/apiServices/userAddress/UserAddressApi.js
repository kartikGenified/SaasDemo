import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const UserAddressApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    addAddress: builder.mutation({
      query(params) {
        console.log("params",params)
        return {
          url: `/api/app/address`,
          method: 'post',
          headers: {
            slug: slug,
            'Content-Type': 'application/json',
        Authorization: "Bearer " + params.token,

          },
          body:params.data
        };
      },
    }),
    getAllAddress: builder.mutation({
        query(params) {
          console.log(params)
          return {
            url: `/api/app/address`,
            method: 'get',
            headers: {
              slug: slug,
              'Content-Type': 'application/json',
        Authorization: "Bearer " + params.token,

            },
           
          };
        },
      }),
      updateAddress: builder.mutation({
        query(params) {
          console.log(params)
          return {
            url: `/api/app/address`,
            method: 'put',
            headers: {
              slug: slug,
              'Content-Type': 'application/json',
        Authorization: "Bearer " + params.token,

            },
            body:params.data
           
          };
        },
      }),
      deleteAddress: builder.mutation({
        query(params) {
          console.log("deleteAddressMutation", params)
          return {
            url: `/api/app/address/${params.data.id}`,
            method: 'delete',
            headers: {
              slug: slug,
              'Content-Type': 'application/json',
        Authorization: "Bearer " + params.token,

            },
            body:params.data
           
          };
        },
      }),
      getActiveAddress: builder.mutation({
        query(params) {
          console.log(params)
          return {
            url: `/api/app/address/active`,
            method: 'get',
            headers: {
              slug: slug,
              'Content-Type': 'application/json',
        Authorization: "Bearer " + params.token,

            },
           
          };
        },
      }),
  }),
});

export const {useAddAddressMutation,useDeleteAddressMutation,useGetActiveAddressMutation,useGetAllAddressMutation,useUpdateAddressMutation} = UserAddressApi;
