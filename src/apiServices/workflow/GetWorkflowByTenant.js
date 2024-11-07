import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const GetWorkflowByTenant = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getWorkflow : builder.mutation({
            query({userId,token}){
                console.log(token,"and useId is",userId)
                return {
                    method: 'GET',
                    url: `api/admin/workflow?tenant_id=${slug}&user_type_id=${userId}`,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token,
                        slug:slug
                    },
                    
                   
                }
            }
        })
    })
});


export const {useGetWorkflowMutation} = GetWorkflowByTenant

