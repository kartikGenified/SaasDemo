import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const UserRegisterApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    registerUser: builder.mutation({
      query({mobile, name, user_type_id, user_type,is_approved_needed}) {
        console.log(mobile, name, user_type_id, user_type,is_approved_needed)
        return {
          url: `/api/app/appUserLogin/`,
          method: 'post',
          headers: {
            slug: slug,
            'Content-Type': 'application/json',
          },
          body:{
            "mobile" : mobile,
            "name":name,
            "user_type_id" : user_type_id,
            "user_type" : user_type,
            "is_approved_needed" : is_approved_needed
        }
        };
      },
    }),
    registerUserByBody: builder.mutation({
      query: (body) => {
        console.log("body ......................",body);

        
        return {
          method: "POST",
          url: "/api/app/appUserLogin/",
          headers: {
            slug: slug,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };
      },
    }),
    updateProfileAtRegistration: builder.mutation({
      query: (params) => {
        console.log("object-00988900--->",params);
        return {
          method: "PATCH",
          url: `/api/app/registration/${params.id}`,
          headers: {
            slug : slug,
          },
          body : params.body
        };
      },
    }),
  }),
});

export const {useRegisterUserMutation,useRegisterUserByBodyMutation,useUpdateProfileAtRegistrationMutation} = UserRegisterApi;
