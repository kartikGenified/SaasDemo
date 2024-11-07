import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const getLocationFromPincode = baseApi.injectEndpoints({
    endpoints: (builder) => ({
    getLocationFromPin: builder.mutation({
    query: (params) => {
        console.log("getLocationFromPin params", params)
    return {
    method: "GET",
    url: `/api/app/pincode/${params.pincode}`,
    headers: {
    Authorization: "Bearer " + params.token,
    slug: slug,
    },
    };
    },
    }),
    }),
   });
   
   export const { useGetLocationFromPinMutation} = getLocationFromPincode;

