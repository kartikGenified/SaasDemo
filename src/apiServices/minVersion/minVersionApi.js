import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";

export const minVersionApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        checkVersionSupport : builder.mutation({
            query(minVersion){
                console.log("From min version api",minVersion)
                return {
                    url:`/api/tenant/app-versions/check`,
                    method:'post',
                    headers:{
                        "slug":slug,
                        "Content-Type": "application/json"
                    },
                    body:{
                        "version":minVersion
                    }
                    
                   
                }
            }
        })
    })
});


export const {useCheckVersionSupportMutation} = minVersionApi

