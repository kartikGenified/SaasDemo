import { baseApi } from "../../baseApi";
import { slug } from "../../../utils/Slug";

export const PasswordLoginApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        passwordLogin : builder.mutation({
            query({user_id,password,fcm_token,app_version}){
                console.log("Password Login API",user_id,password)
                return {
                    url:`/api/app/appUserLogin/login`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json"
                    },
                    body:{
                        "user_id" : user_id,
                        "password" : password,
                        "fcm_token":fcm_token,
                        "app_version":app_version
                    }
                    
                   
                }
            }
        })
    })
});


export const {usePasswordLoginMutation} = PasswordLoginApi

