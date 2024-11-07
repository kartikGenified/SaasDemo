import {baseApi} from '../../baseApi';
import {slug} from '../../../utils/Slug';
export const GetGenuinityApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    claimGenuinity: builder.mutation({
      query({token,data}) {
        console.log("token and data is",token,data)
        return {
          method: 'POST',
          url: `api/tenant/genunityclaim/add?qr_id=${data.product_id}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            slug: slug,
          },
          body: JSON.stringify(data),
        };
      },
    }),
    checkGenuinity: builder.mutation({
      query({qrId,token}) {
        // console.log("Qr id and token is",qrId,token)
        return {
          method: 'GET',
          url: `api/tenant/genunityclaim/check?qr_id=${qrId}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            slug: slug,
          },
        };
      },
    }),
  }),
});

export const {useClaimGenuinityMutation, useCheckGenuinityMutation} = GetGenuinityApi;
