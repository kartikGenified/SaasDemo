import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const GetOtpApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getLoginOtpForVerification : builder.mutation({
            query({mobile,name,user_type_id,user_type,type}){
                console.log("From api",mobile,name,user_type_id,user_type)
                return {
                    url:`/api/app/userOtp/otp`,
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
                        "type":type
                        
                    }
                    
                   
                }
            }
        })
    })
});


export const {useGetLoginOtpForVerificationMutation} = GetOtpApi

