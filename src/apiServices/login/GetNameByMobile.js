import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetNameByMobile = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getName: builder.mutation({
            query: (body) => {
              return {
                method: "GET",
                url: `api/app/appUsersName?mobile=${body.mobile}`,
                headers: {
                  "Content-Type": "application/json",
                  slug: slug,
                },
              };
            },
          }),
    })
});


export const {useGetNameMutation} = GetNameByMobile

