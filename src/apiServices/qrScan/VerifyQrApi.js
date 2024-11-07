import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const VerifyQrApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        verifyQr : builder.mutation({
            query({token,data}){
                console.log("from verifyqr api",data)
                return {
                    url:`api/tenant/qr/verify`,
                    method:'post',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${token}`,
                    },
                    body:JSON.stringify(data)
                    
                   
                }
            }
        })
    })
});


export const {useVerifyQrMutation} = VerifyQrApi

