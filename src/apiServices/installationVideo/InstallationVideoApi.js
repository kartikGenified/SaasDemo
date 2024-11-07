import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const InstallationVideoApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    productInstallationVideo: builder.mutation({
        query: (token) => {
          return {
              method: "GET",
              url: `/api/app/product-installation-videos?limit=10&offset=0`,
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
                slug: slug,
              },
            };
        },
      }),
    
  }),
});

export const {useProductInstallationVideoMutation} = InstallationVideoApi;