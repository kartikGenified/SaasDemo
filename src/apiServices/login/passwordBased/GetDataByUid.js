import { baseApi } from "../../baseApi";
import { slug } from "../../../utils/Slug";

export const GetDataByUid = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getUserData: builder.mutation({
            query: (body) => {
              return {
                method: "GET",
                url: `api/app/appUsersName?uid=${body.uid}`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                },
              };
            },
          }),
    })
});


export const {useGetUserDataMutation} = GetDataByUid

