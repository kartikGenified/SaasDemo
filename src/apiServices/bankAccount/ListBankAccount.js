import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const ListBankAccount = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        listAccounts : builder.mutation({
            query(params){
                console.log(params)
                return {
                    url:`/api/app/bankDetail/${params.userId}`,
                    method:'Get',
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


export const {useListAccountsMutation} = ListBankAccount

