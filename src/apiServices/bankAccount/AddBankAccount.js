import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const AddBankAccount = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        addBankDetails : builder.mutation({
            query(params){
                console.log(params)
                return {
                    url:`/api/app/bankDetail/add`,
                    method:'Post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${params.token}`,
                    },
                    body:params.data
                    
                   
                }
            }
        })
    })
});


export const {useAddBankDetailsMutation} = AddBankAccount

