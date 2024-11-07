import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const SendCredentialsApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    sendCredentials: builder.mutation({
      query({userId,token}) {
        console.log(token)
        return {
          url: `/api/app/profile/${JSON.stringify(userId)}`,
          method: 'put',
          headers: {
            "slug": slug,
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body:{
            "status":1
        }
        };
      },
    }),
  }),
});

export const {useSendCredentialsMutation} = SendCredentialsApi;
