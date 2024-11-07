import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const ImageGalleryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getAppGallery: builder.mutation({
    query: (token) => {
    return {
    method: "GET",
    url: `/api/tenant/appGallery`,
    headers: {
    Authorization: "Bearer " + token,
    slug: slug,
    },
    };
    },
    }),
    }),
   });
   
   export const { useGetAppGalleryMutation} = ImageGalleryApi;