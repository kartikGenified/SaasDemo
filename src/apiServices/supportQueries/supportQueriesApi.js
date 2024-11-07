import { baseApi } from '../baseApi';
import { slug } from '../../utils/Slug';

export const supportQueriesApi = baseApi.injectEndpoints({
    endpoints: builder => ({
        getQueriesType: builder.mutation({
            query: (params) => {
                console.log(params)
                return {
                    method: "GET",
                    url: `/api/tenant/supportQueries/types`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + params.token,
                        slug: slug,
                    },

                };
            },
        }),

        submitQueries: builder.mutation({
            query: (params) => {
                console.log(params)
                return {
                    method: "POST",
                    url: `/api/tenant/supportQueries/add`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + params.token,
                        slug: slug,
                    },
                    body: params.body

                };
            },
        }),

        getSupportQueriesById: builder.mutation({
            query: (params) => {
                console.log(params)
                return {
                    method: "POST",
                    url: `/api/tenant/supportQueries`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + params.token,
                        slug: slug,
                    },
                    body: params.body
                };
            },
        }),


    }),
});

export const {
    useGetQueriesTypeMutation,
    useSubmitQueriesMutation,
    useGetSupportQueriesByIdMutation
} = supportQueriesApi;