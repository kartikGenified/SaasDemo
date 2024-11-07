import {baseApi} from '../../baseApi';
import {slug} from '../../../utils/Slug';
export const GetCashback = baseApi.injectEndpoints({
  endpoints: builder => ({
    checkQrCodeAlreadyRedeemed: builder.mutation({
      query: params => {
        return {
          method: 'GET',
          url: `api/app/userCashbackEnteries/check?qr_id=${params.qrId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
        };
      },
    }),
    addCashbackEnteries: builder.mutation({
      query: params => {
        console.log('params--->', params);
        return {
          method: 'POST',
          url: `api/app/userCashbackEnteries/add?qr_id=${params.qrId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
          body: params.body,
        };
      },
    }),
    fetchCashbackEnteriesOfUser: builder.mutation({
      query: params => {
        console.log('params--->', params);
        return {
          method: 'GET',
          url: `api/app/userCashbackEnteries?app_user_id=${params.userId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
        };
      },
    }),
  }),
});

export const {useAddCashbackEnteriesMutation,useCheckQrCodeAlreadyRedeemedMutation,useFetchCashbackEnteriesOfUserMutation} = GetCashback;
