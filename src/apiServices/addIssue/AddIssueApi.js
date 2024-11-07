import { slug } from "../../utils/Slug";
import { baseApi } from "../baseApi";

export const AddIssueApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        addIssue: builder.mutation({
            query: (body) => {
              return {
                method: "POST",
                url: `/api/tenant/issue/add`,
                headers: {
                  "Content-Type": "application/json",
                  Authorization: "Bearer " + body.token,
                  slug: slug,
                },
                body: JSON.stringify(body.data),
              };
            },
          }),
    })
});


export const {useAddIssueMutation} = AddIssueApi

