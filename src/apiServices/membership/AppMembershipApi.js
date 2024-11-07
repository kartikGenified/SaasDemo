import { baseApi } from '../baseApi';
import {slug} from '../../utils/Slug';

export const AppMembershipApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getActiveMembership: builder.mutation({
    query: (token) => {
    return {
    method: "POST",
    url: `/api/app/membership/active`,
    headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer " + token,
    slug: slug,
    },
    };
    },
    }),
    getOzoneActiveMembership: builder.mutation({
        query: (token) => {
            console.log("getOzoneActiveMembership",token)
        return {
        method: "GET",
        url: `/api/tenant/oopl/membership`,
        headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
        slug: slug,
        },
        };
        },
        }),
   
    getMembership: builder.mutation({
    query: (token) => {
        console.log(token)
    return {
    method: "GET",
    url: `/api/app/membership`,
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
   
   export const { useGetActiveMembershipMutation,useGetMembershipMutation,useGetOzoneActiveMembershipMutation} = AppMembershipApi;