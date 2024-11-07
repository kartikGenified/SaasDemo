import {baseApi} from '../../baseApi';
import {slug} from '../../../utils/Slug';
export const GetForms = baseApi.injectEndpoints({
  endpoints: builder => ({
    getCouponOnCategory: builder.mutation({
      query: params => {
        console.log("getCouponOnCategoryApi",params)
        return {
          method: 'GET',
          url: `api/app/couponRedemption/category/${params.catId}?qr_code=${params.qr_code}`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
        };
      },
    }),
    getAllRedeemedCoupons: builder.mutation({
      query: (params) => {
        return {
          method: "GET",
          url: `api/app/couponRedemption/`,
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

export const {useGetCouponOnCategoryMutation,useGetAllRedeemedCouponsMutation} = GetForms;
