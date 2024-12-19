import { baseApi } from "../../baseApi";
import { slug } from "../../../utils/Slug";
export const updatePassword = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        updatePasswordForDistributor : builder.mutation({
            query({data}){
                return {
                    url:`api/app/appUserLogin/password`,
                    method:'post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                    },
                    body:data
                    
                   
                }
            }
        }),

    })
});


export const {useUpdatePasswordForDistributorMutation} = updatePassword