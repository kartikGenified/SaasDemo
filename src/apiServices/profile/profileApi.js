import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';
export const profileApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    fetchProfile: builder.mutation({
      query: token => {
        return {
          method: 'GET',
          url: `/api/app/profile`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            slug: slug,
          },
        };
      },
    }),
    updateProfile: builder.mutation({
      query: params => {
        console.log("update profile params",JSON.stringify(params))
        return {
          method: 'PUT',
          url: `/api/app/profile`,
          headers: {
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
          body: params.data,
        };
      },
    }),
    updateProfileAtRegistration: builder.mutation({
      query: params => {
        console.log('object-00988900--->', params);
        return {
          method: 'PATCH',
          url: `api/app/registration/${params.id}`,
          headers: {
            slug: slug,
          },
          body: params.body,
        };
      },
    }),
    sendSMSForUserIdAndPassword: builder.mutation({
      query: params => {
        return {
          method: 'PUT',
          url: `/app/profile/${params.id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
          body: params.data,
        };
      },
    }),
    verifyReferralCode: builder.mutation({
      query: params => {
        return {
          method: 'GET',
          url: `/app/verifyReferralCode/${params.id}/${params.code}`,
          headers: {
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
        };
      },
    }),
  }),
});

export const {
  useFetchProfileMutation,
  useUpdateProfileMutation,
  useUpdateProfileAtRegistrationMutation,
  useSendSMSForUserIdAndPasswordMutation,
  useVerifyReferralCodeMutation,
} = profileApi;
