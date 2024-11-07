import {baseApi} from '../baseApi';
import {slug} from '../../utils/Slug';

export const fetchCateloguesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        productCatalogue: builder.mutation({
        query: (params) => {
        return {
        method: "GET",
        url: `/api/tenant/eCatalogue/?limit=${params.limit}&&offset=${params.offset}`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + params.token,
        slug: slug
        },
        };
        },
        }),
        }),
       });
       
       export const { useProductCatalogueMutation } = fetchCateloguesApi;
