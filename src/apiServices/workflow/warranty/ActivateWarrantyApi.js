import {baseApi} from '../../baseApi';
import {slug} from '../../../utils/Slug';
export const ActivateWarrantyApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    activateWarranty: builder.mutation({
      query({token, body}) {
        console.log(token, 'and warrantydata is',  body);
        return {
          method: 'POST',
          url: `/api/app/warranty/add`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            slug: slug,
          },
          body: body,
        };
      },
    }),

    checkWarranty: builder.mutation({
      query({form_type, token, body}) {
        console.log(token, 'and formId is', form_type,body);
        return {
          method: 'POST',
          url: `/api/app/warranty/status`,
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token,
            slug: slug,
          },
          body: JSON.stringify(body),
        };
        // return {
        //   method: 'POST',
        //   url: `/app/warranty/status`,
        //   headers: {
        //     'Content-Type': 'application/json',
        //     Authorization: 'Bearer ' + token,
        //     slug: slug,
        //   },
        //   body: JSON.stringify(body),
        // };
      },
    }),
    getWarrantyByAppUserId: builder.mutation({
      query(params) {
        // console.log(token);
        return {
          method: 'GET',
          url: `/api/app/warranty`,
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

export const {
  useActivateWarrantyMutation,
  useCheckWarrantyMutation,
  useGetWarrantyByAppUserIdMutation,
} = ActivateWarrantyApi;
