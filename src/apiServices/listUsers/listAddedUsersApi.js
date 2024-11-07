import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const listAddedUsersApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    listAddedUsers: builder.mutation({
    query: (params) => {
    return {
    method: "GET",
    url: `/api/app/addUser/${params.userId}`,
    headers: {
    Authorization: "Bearer " + params.token,
    slug: slug,
    },
    };
    },
    }),
    }),
   });
   
   export const { useListAddedUsersMutation} = listAddedUsersApi;

