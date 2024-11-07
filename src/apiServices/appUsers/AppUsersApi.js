import { baseApi } from "../baseApi";
import { slug } from "../../utils/Slug";
export const AppUsersApi = baseApi.injectEndpoints({
    endpoints:(builder) =>({
        getAppUsersData : builder.mutation({
            query(){
                return {
                    url:`/api/app/appUserType/only`,
                    method:'get',
                    headers:{
                        "Content-Type": "application/json",
                        "slug":slug
                    },
                    
                   
                }
            }
        })
    })
});


export const {useGetAppUsersDataMutation} = AppUsersApi

