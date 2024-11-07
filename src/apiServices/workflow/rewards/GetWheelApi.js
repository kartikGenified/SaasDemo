import {baseApi} from '../../baseApi';
import {slug} from '../../../utils/Slug';

export const GetWheel = baseApi.injectEndpoints({
  endpoints: builder => ({
    getallWheelsByUserId: builder.mutation({
      query: params => {
        return {
          method: 'GET',
          url: `api/tenant/wheel/userTypeId/${params.id}`,
          headers: {
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
        };
      },
    }),
    createWheelHistory: builder.mutation({
      query: params => {
        console.log("params",params)
        return {
          method: 'POST',
          url: `api/app/wheelHistory/add`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
          body: JSON.stringify(params.body),
        };
      },
    }),
    getAllWheelHistory: builder.mutation({
      query: params => {
        return {
          method: 'GET',
          url: `api/app/wheelHistory`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
        };
      },
    }),
    updateWheelHistory: builder.mutation({
      query: params => {
        return {
          method: 'PUT',
          url: `api/app/wheelHistory/${params.id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
          body: JSON.stringify(params.body),
        };
      },
    }),
  }),
});

export const {
  useGetallWheelsByUserIdMutation,
  useCreateWheelHistoryMutation,
  useGetAllWheelHistoryMutation,
  useUpdateWheelHistoryMutation
} = GetWheel;
