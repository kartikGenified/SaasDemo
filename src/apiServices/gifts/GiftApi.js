
import { slug } from "../../utils/Slug";
import { baseApi } from "../baseApi";

export const GiftApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        fetchAllGift: builder.mutation({
            query: (params) => {
              return {
                method: "GET",
                // url: `/tenant/gift/?limit=${params.limit}&&offset=${params.offset}&&giftName=${params.giftName}`,
                url: `api/tenant/giftCatalogue/active`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
              };
            },
          }),
      
          fetchGiftCatalogueByUserTypeAndCatalogueType: builder.mutation({
            query: (params) => {
              return {
                method: "GET",
                url: `api/tenant/giftCatalogue/userType?type=${params.type}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
              };
            },
          }),
      
          fetchGiftById: builder.mutation({
            query: (params) => {
              return {
                method: "GET",
                url: `api/tenant/gift/${params.id}`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + params.token,
                  slug: slug,
                },
              };
            },
          }),
    })
});


export const {useFetchAllGiftMutation,useFetchGiftByIdMutation,useFetchGiftCatalogueByUserTypeAndCatalogueTypeMutation} = GiftApi

