import { baseApi } from "../../baseApi";
import { slug } from "../../../utils/Slug";

export const SendOtpApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getLoginOtp : builder.mutation({
            query({mobile,name,user_type_id,user_type}){
                console.log("From api",mobile,name,user_type_id,user_type)
                return {
                    url:`/api/app/userOtp/add`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json"
                    },
                    body:{
                        "mobile" : mobile,
                        "name":name,
                        "user_type_id" : user_type_id,
                        "user_type" : user_type,
                        
                    }
                    
                   
                }
            }
        })
    })
});


export const {useGetLoginOtpMutation} = SendOtpApi

