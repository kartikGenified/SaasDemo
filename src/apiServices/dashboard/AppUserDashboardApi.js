import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";





export const AppUserDashboardApi = baseApi.injectEndpoints({
    endpoints: (builder) =>({
        getAppDashboardData : builder.mutation({
            query(token){
                
                console.log("token is",token)
                return {
                    url:`/api/app/appUserDashboard/`,
                    method:'get',
                    headers:{
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                        "slug":slug
                    }, 
                }
            }
        })
    })
});


export const {useGetAppDashboardDataMutation} = AppUserDashboardApi

