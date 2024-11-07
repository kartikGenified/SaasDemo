import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const VideoApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getAppVideo: builder.mutation({
    query: (params) => {
    return {
    method: "GET",
    url: `/api/tenant/appVideo${params.type?`?type=${params.type}`:""}`,
    headers: {
    Authorization: "Bearer " + params.token,
    slug: slug,
    },
    };
    },
    }),
    }),
   });
   
   export const { useGetAppVideoMutation} = VideoApi;