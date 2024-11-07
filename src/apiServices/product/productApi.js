import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const productApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getProductData: builder.mutation({
      query({productCode , userType, token}) {
        // console.log("token product code and userType is",token, productCode,  userType);
        return {
          method: 'POST',
          url: `/api/tenant/productPoints/?product_code=${productCode}&user_type=${userType}`,
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

export const {useGetProductDataMutation} = productApi;
