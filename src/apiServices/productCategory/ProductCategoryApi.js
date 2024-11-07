import { baseApi } from '../baseApi';
import {slug} from '../../utils/Slug';

export const ProductCategoryApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getProductSubCategoryById: builder.mutation({
            query: (params) => {
                console.log("getProductSubCategoryById",params)
              return {
                method: "GET",
                url: `/api/app/product/${params.subCategoryId}?limit=${params.limit}&offset=${params.offset}`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                
              };
            },
          }),
          getProductCategory: builder.mutation({
            query: (token) => {
              return {
                method: "GET",
                url: `/api/app/subcategory`,
                headers: {
                  Authorization: "Bearer " + token,
                  slug: slug,
                },
                
              };
            },
          }),
          getProductLevel: builder.mutation({
            query: (params) => {
              console.log("params",params)
              return {
                method: "GET",
                url: `/api/tenant/heirarchy/level/?level=${params.level}`,
                headers: {
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
                
              };
            },
          }),
          
        }),
        
   });
   
   export const {useGetProductCategoryMutation,useGetProductSubCategoryByIdMutation,useGetProductLevelMutation} = ProductCategoryApi;