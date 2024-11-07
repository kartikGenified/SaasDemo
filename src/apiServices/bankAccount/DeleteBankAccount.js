import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const DeleteBankAccount = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        deleteBank : builder.mutation({
            query(params){
                console.log("params",params)
                return {
                    url:`/api/app/bankDetail/${params.id}`,
                    method:'DELETE',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${params.token}`,
                    },
                    
                    
                   
                }
            }
        })
    })
});


export const {useDeleteBankMutation} = DeleteBankAccount

