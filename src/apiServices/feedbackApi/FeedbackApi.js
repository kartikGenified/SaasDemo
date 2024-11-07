import {baseApi} from '../baseApi';
import { slug } from '../../utils/Slug';
export const FeedbackApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    addFeedback: builder.mutation({
      query: params => {
        console.log(params.body)
        return {
          method: 'POST',
          url: `/api/app/feedback/add`,
          headers: {
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
          body: params.body,
        };
      },
    }),

    getFeedback: builder.mutation({
      query({file_name, token}) {
        console.log('image file name', file_name, token);
        return {
          method: 'GET',
          url: `/api/app/feedback`,
          headers: {
            Authorization: 'Bearer ' + token,
            slug:slug
        },
        };
      },
    }),
  }),
});

export const {useAddFeedbackMutation, useGetFeedbackMutation} = FeedbackApi;
