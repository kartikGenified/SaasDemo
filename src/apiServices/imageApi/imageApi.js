import {baseApi} from '../baseApi';
import { slug } from '../../utils/Slug';
export const imageApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    uploadImages: builder.mutation({
      query: params => {
        console.log(params.body)
        return {
          method: 'POST',
          url: `api/images/upload`,
          headers: {
            slug: slug,
          },
          body: params.body,
        };
      },
    }),

    getImages: builder.mutation({
      query({file_name, token}) {
        console.log('image file name', file_name, token);
        return {
          method: 'GET',
          url: `api/app/images/${file_name}`,
          headers: {Authorization: 'Bearer ' + token},
        };
      },
    }),
    uploadSingleFile: builder.mutation({
      query: (params) => {
        console.log("uploadSingleFile",params)
        return {
          method: "POST",
          url: "api/file/single",
          headers: {Authorization: 'Bearer ' + params.token},
          body: params.body,
        };
      },
    }),
  
    uploadMultipleFiles: builder.mutation({
      query: (params) => {
        return {
          method: "POST",
          url: "api/file/multiple",
          headers: {Authorization: 'Bearer ' + params.token},
          body: params.body,
        };
      },
    }),
  }),
 
});

export const {useUploadImagesMutation, useGetImagesMutation,useUploadSingleFileMutation,useUploadMultipleFilesMutation} = imageApi;
