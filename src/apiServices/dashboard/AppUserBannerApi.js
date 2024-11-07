import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const AppUserBannerApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppUserBannerData : builder.mutation({
            query(token){
                console.log("Banner data getAppUserBannerData",token)
                return {
                    url:`api/tenant/appBanner`,
                    method:'get',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug,
                        "Authorization": `Bearer ${token}`,
                    },
                    
                   
                }
            }
        })
    })
});


export const {useGetAppUserBannerDataMutation} = AppUserBannerApi

