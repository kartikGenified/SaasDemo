import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const pointSharingApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getPointSharingData: builder.mutation({
      query(params) {
        console.log("data point sharing",params);
        return {
          method: 'GET',
          url:`/api/app/extraPoint/${params.id}?limit=100&offset=0&type=${params.cause}`,
         
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + params.token,
            slug: slug,
          },
        };
      },
    }),
    extraPointEnteries: builder.mutation({
        query: (body) => {
          return {
            method: "POST",
            url: `api/app/extraPoint/add?qr_id=${body.qrId}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + body.token,
              slug: slug
            },
            body: JSON.stringify(body.data),
          };
        },
      }),
    
      addRegistrationBonus: builder.mutation({
        query: (body) => {
          console.log("addRegistrationBonus",body)
          return {
            method: "POST",
            url: `api/app/extraPoint/add-extra-points`,
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + body.token,
              slug: slug,
            },
            body: JSON.stringify(body.data),
          };
        },
      }),
  }),
});

export const {useGetPointSharingDataMutation,useAddRegistrationBonusMutation,useExtraPointEnteriesMutation} = pointSharingApi;
